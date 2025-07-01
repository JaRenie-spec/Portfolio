"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const author_routes_1 = __importDefault(require("./routes/author.routes"));
const book_routes_1 = __importDefault(require("./routes/book.routes"));
const event_routes_1 = __importDefault(require("./routes/event.routes"));
const review_routes_1 = __importDefault(require("./routes/review.routes"));
const purchase_routes_1 = __importDefault(require("./routes/purchase.routes"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// ⚙️ Swagger UI (facultatif)
const swaggerSpec = (0, swagger_jsdoc_1.default)({
    definition: {
        openapi: '3.0.0',
        info: { title: 'API eBook Store', version: '1.0.0' },
        servers: [{ url: `http://localhost:${process.env.PORT || 3000}` }],
        components: {
            securitySchemes: {
                bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
            }
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ['./src/routes/*.ts'],
});
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
app.use('/api/users', user_routes_1.default);
app.use('/api/authors', author_routes_1.default);
app.use('/api/books', book_routes_1.default);
app.use('/api/events', event_routes_1.default);
app.use('/api/reviews', review_routes_1.default);
app.use('/api/purchases', purchase_routes_1.default);
exports.default = app;
