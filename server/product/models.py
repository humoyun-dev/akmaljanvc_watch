from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Brand(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='products/', null=True, blank=True)

    # Soatga xos xususiyatlar
    watch_type = models.CharField(
        max_length=50,
        choices=[
            ('analog', 'Analog'),
            ('digital', 'Digital'),
            ('smart', 'Smartwatch'),
            ('hybrid', 'Hybrid')
        ],
        default='analog'
    )
    material = models.CharField(
        max_length=100,
        choices=[
            ('leather', 'Leather'),
            ('metal', 'Metal'),
            ('plastic', 'Plastic'),
            ('rubber', 'Rubber'),
            ('other', 'Other')
        ]
    )
    water_resistance = models.PositiveIntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(300)],
        help_text="Water resistance in meters (e.g., 30 for 30m)"
    )
    battery_life = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="Battery life in days (for digital and smartwatches)"
    )
    strap_length = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Strap length in centimeters"
    )
    dial_size = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Dial size in millimeters"
    )
    weight = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Weight in grams"
    )

    # Qo'shimcha ma'lumotlar
    is_in_stock = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name