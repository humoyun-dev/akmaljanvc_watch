from rest_framework import serializers
from .models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity', 'price', 'total_price']
        read_only_fields = ['price', 'total_price']

    def validate(self, data):
        """
        Custom validation for the OrderItem.
        """
        product = data.get('product')
        quantity = data.get('quantity')

        if not product:
            raise serializers.ValidationError("Product must be specified.")
        if quantity <= 0:
            raise serializers.ValidationError("Quantity must be greater than zero.")

        # Automatically set the price based on the product's current price
        data['price'] = product.price
        return data


class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True, required=False)

    class Meta:
        model = Order
        fields = [
            'id', 'first_name', 'last_name', 'phone_number', 'created_at', 'updated_at',
            'status', 'total_price', 'payment_method', 'shipping_address',
            'order_items'
        ]
        read_only_fields = ['total_price', 'created_at', 'updated_at']

    def validate(self, data):
        """
        Custom validation for the Order.
        """
        shipping_address = data.get('shipping_address')

        if not shipping_address:
            raise serializers.ValidationError("Shipping address is required.")
        return data

    def create(self, validated_data):
        """
        Create an Order instance along with its related OrderItems.
        """
        order_items_data = validated_data.pop('order_items', [])
        order = Order.objects.create(**validated_data)

        for item_data in order_items_data:
            OrderItem.objects.create(order=order, **item_data)

        # Recalculate total price after creating items
        order.total_price = order.calculate_total_price()
        order.save(update_fields=["total_price"])
        return order

    def update(self, instance, validated_data):
        """
        Update an existing Order instance along with its related OrderItems.
        """
        order_items_data = validated_data.pop('order_items', [])

        # Update the main Order fields
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.status = validated_data.get('status', instance.status)
        instance.payment_method = validated_data.get('payment_method', instance.payment_method)
        instance.shipping_address = validated_data.get('shipping_address', instance.shipping_address)
        instance.billing_address = validated_data.get('billing_address', instance.billing_address)
        instance.save()

        # Handle nested OrderItems
        for item_data in order_items_data:
            item_id = item_data.get('id', None)
            if item_id:
                # Update existing OrderItem
                order_item = OrderItem.objects.get(id=item_id, order=instance)
                order_item.product = item_data.get('product', order_item.product)
                order_item.quantity = item_data.get('quantity', order_item.quantity)
                order_item.save()
            else:
                # Create new OrderItem
                OrderItem.objects.create(order=instance, **item_data)

        # Recalculate total price after updating items
        instance.total_price = instance.calculate_total_price()
        instance.save(update_fields=["total_price"])
        return instance