from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    PAYMENT_METHOD_CHOICES = [
        ('cash_on_delivery', 'Cash on Delivery'),
        ('credit_card', 'Credit Card'),
        ('paypal', 'PayPal'),
        ('other', 'Other'),
    ]

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=12)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        editable=False,
        default=0
    )
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default='cash_on_delivery')
    shipping_address = models.TextField()

    def clean(self):
        """Custom validation logic for the Order model."""
        if not self.shipping_address:
            raise ValidationError("Shipping address is required.")

    def calculate_total_price(self):
        """Calculate the total price of the order based on its items."""
        # If there are no items (or if the order is unsaved), the sum will be 0.
        return sum(item.total_price for item in self.order_items.all())

    def save(self, *args, **kwargs):
        """
        On first save (when there's no primary key), we skip recalculating total price
        since related items cannot exist yet. For subsequent saves, update total_price.
        """
        self.full_clean()
        if self.pk is None:
            # New Order: save it first so that it gets a primary key.
            self.total_price = 0  # No items yet.
            super().save(*args, **kwargs)
        else:
            # Existing Order: update total_price based on related order items.
            self.total_price = self.calculate_total_price()
            super().save(*args, **kwargs)

    def __str__(self):
        return f"Order #{self.id} by {self.phone_number}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='order_items')
    product = models.ForeignKey('product.Product', on_delete=models.SET_NULL, null=True)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    @property
    def total_price(self):
        """Calculate the total price for this specific order item."""
        return self.quantity * (self.price or 0)

    def clean(self):
        """Custom validation logic for the OrderItem model."""
        if not self.product:
            raise ValidationError("Product must be specified.")
        # Set the price to the product's current price.
        self.price = self.product.price

        if self.quantity <= 0:
            raise ValidationError("Quantity must be greater than zero.")

    def save(self, *args, **kwargs):
        """
        Validate the order item, save it, and then update the parent Order's total price.
        """
        self.full_clean()  # Run validations.
        super().save(*args, **kwargs)
        # Now that the OrderItem is saved, update the Order's total price.
        if self.order.pk:  # This check is usually not necessary in admin (order is already saved).
            self.order.total_price = self.order.calculate_total_price()
            self.order.save(update_fields=["total_price"])

    def __str__(self):
        product_name = self.product.name if self.product else 'Unknown Product'
        return f"{self.quantity} x {product_name} in Order #{self.order.id}"
