from django.contrib import admin
from django.utils.html import format_html
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    """
    Inline admin for OrderItem to display related items within an Order.
    """
    model = OrderItem
    extra = 0  # No extra empty rows by default
    readonly_fields = ('total_price_display',)

    @admin.display(description="Total Price")
    def total_price_display(self, obj):
        """
        Display the total price of the order item in a formatted way.
        """
        return f"UZS {obj.total_price:.2f}"


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Order model.
    """
    list_display = (
        'id',
        'full_name',
        'phone_number',
        'status',
        'payment_method',
        'total_price_display',
        'created_at',
        'updated_at'
    )
    list_filter = (
        'status',
        'payment_method',
        'created_at',
        'updated_at'
    )
    search_fields = (
        'first_name',
        'last_name',
        'phone_number',
        'shipping_address',
        'billing_address'
    )
    readonly_fields = ('total_price_display', 'created_at', 'updated_at')
    inlines = (OrderItemInline,)  # Include OrderItem inline

    @admin.display(description="Full Name")
    def full_name(self, obj):
        """
        Display the full name of the customer.
        """
        return f"{obj.first_name} {obj.last_name}"

    @admin.display(description="Total Price")
    def total_price_display(self, obj):
        """
        Display the total price of the order in a formatted way.
        """
        return format_html(f"<strong>UZS {obj.total_price:.2f}</strong>")


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    """
    Admin configuration for the OrderItem model.
    """
    list_display = (
        'id',
        'order_id',
        'product_name',
        'quantity',
        'price',
        'total_price_display'
    )
    list_filter = ('order__status', 'order__payment_method')
    search_fields = ('order__id', 'product__name')

    @admin.display(description="Order ID")
    def order_id(self, obj):
        """
        Display the ID of the associated order.
        """
        return obj.order.id

    @admin.display(description="Product Name")
    def product_name(self, obj):
        """
        Display the name of the associated product.
        """
        return obj.product.name if obj.product else "Unknown Product"

    @admin.display(description="Total Price")
    def total_price_display(self, obj):
        """
        Display the total price of the order item in a formatted way.
        """
        return f"UZS {obj.total_price:.2f}"