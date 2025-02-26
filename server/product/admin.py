from django.contrib import admin
from .models import Category, Brand, Product

# Register Category model with filters
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

# Register Brand model with filters
@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

# Register Product model with filters
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    # Displayed columns in the admin list view
    list_display = (
        'name',
        'category',
        'brand',
        'price',
        'watch_type',
        'material',
        'water_resistance',
        'is_in_stock',
        'created_at',
        'updated_at'
    )

    # Add filters for specific fields
    list_filter = (
        'category',  # Filter by category
        'brand',     # Filter by brand
        'watch_type',  # Filter by watch type
        'material',  # Filter by material
        'is_in_stock',  # Filter by stock availability
        'created_at',  # Filter by creation date
        'updated_at'   # Filter by update date
    )

    # Add search functionality for specific fields
    search_fields = (
        'name',
        'description',
        'category__name',
        'brand__name'
    )

    # Make certain fields editable directly in the list view
    list_editable = ('is_in_stock',)

    # Add a date hierarchy for filtering by date
    # date_hierarchy = 'created_at'

    # Customize fieldsets for better organization in the detail view
    fieldsets = (
        ('General Information', {
            'fields': ('name', 'description', 'price', 'category', 'brand', 'image')
        }),
        ('Watch Specifications', {
            'fields': ('watch_type', 'material', 'water_resistance', 'battery_life', 'strap_length', 'dial_size', 'weight')
        }),
        ('Stock and Timestamps', {
            'fields': ('is_in_stock', 'created_at', 'updated_at'),
            'classes': ('collapse',)  # Collapse this section by default
        })
    )

    # Make created_at and updated_at fields read-only
    readonly_fields = ('created_at', 'updated_at')

    # Add ordering options
    ordering = ('-created_at',)
