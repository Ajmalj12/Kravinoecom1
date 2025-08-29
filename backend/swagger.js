import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ecommerce API',
      version: '1.0.0',
      description: 'A comprehensive ecommerce API with user authentication, product management, cart, wishlist, orders, and admin features',
    },
    servers: [
      {
        url: 'https://kravinoecom1.vercel.app',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            password: { type: 'string' },
            cartData: { type: 'object' },
          },
        },
        Product: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            finalPrice: { type: 'number' },
            image: { type: 'array', items: { type: 'string' } },
            category: { type: 'string' },
            subCategory: { type: 'string' },
            sizes: { type: 'array', items: { type: 'string' } },
            bestSeller: { type: 'boolean' },
            date: { type: 'number' },
            reviews: { type: 'array' },
            ratingAverage: { type: 'number' },
            ratingCount: { type: 'number' },
            discountInfo: { type: 'object' },
          },
        },
        Order: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            items: { type: 'array' },
            amount: { type: 'number' },
            address: { type: 'object' },
            status: { type: 'string' },
            paymentMethod: { type: 'string' },
            payment: { type: 'boolean' },
            date: { type: 'number' },
          },
        },
        Category: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            image: { type: 'string' },
            active: { type: 'boolean' },
          },
        },
        Discount: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            type: { type: 'string', enum: ['percentage', 'fixed'] },
            value: { type: 'number' },
            maxDiscountAmount: { type: 'number' },
            applicableProducts: { type: 'array', items: { type: 'string' } },
            startDate: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time' },
            active: { type: 'boolean' },
          },
        },
        Banner: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            image: { type: 'string' },
            link: { type: 'string' },
            section: { type: 'string', enum: ['hero', 'top', 'middle'] },
            active: { type: 'boolean' },
            order: { type: 'number' },
          },
        },
        Address: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string' },
            street: { type: 'string' },
            city: { type: 'string' },
            state: { type: 'string' },
            zipcode: { type: 'string' },
            country: { type: 'string' },
            phone: { type: 'string' },
            isDefault: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Category: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            image: { type: 'string' },
            active: { type: 'boolean' },
            subCategories: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  name: { type: 'string' },
                  description: { type: 'string' }
                }
              }
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Size: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            active: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Section: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            sectionType: { type: 'string' },
            content: { type: 'object' },
            isActive: { type: 'boolean' },
            order: { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        PageContent: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            pageType: { type: 'string' },
            content: { type: 'object' },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Wishlist: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            products: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  productId: { $ref: '#/components/schemas/Product' },
                  addedAt: { type: 'string', format: 'date-time' },
                },
              },
            },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js', './controllers/*.js'], // paths to files containing OpenAPI definitions
};

const specs = swaggerJSDoc(options);

export { swaggerUi, specs };
