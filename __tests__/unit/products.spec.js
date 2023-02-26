const httpMocks = require("node-mocks-http");
const productController = require("../../controller/products");
const productModel = require("../../schemas/Product");
const newProduct = require("../data/new-product.json");
const allProducts = require("../data/all-product.json");

productModel.create = jest.fn();
productModel.find = jest.fn();
productModel.findById = jest.fn();
productModel.findByIdAndUpdate = jest.fn();
productModel.findByIdAndDelete = jest.fn();

const productId = "63f9c2ce7528db699924c644";

const updatedProduct = {
    _id: "63f9c2ce7528db699924c644",
    name: "updated",
    description: "updated",
    price: 15,
    __v: 0,
};

let req, res, next;

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
});

describe("Product Controller Create", () => {
    beforeEach(() => {
        req.body = newProduct;
    });

    it("should have a create product function", () => {
        expect(typeof productController.createProduct).toBe("function");
    });

    it("should call productModel.create", () => {
        productController.createProduct(req, res, next);
        expect(productModel.create).toBeCalledWith(newProduct);
    });

    it("should return 201 response code", async () => {
        await productController.createProduct(req, res, next);
        expect(res.statusCode).toBe(201);
        // _isEndCalled - res.status.json 처럼 send나 json 같은 추가적인 값이 전달되는지
        // toBeTruthy - 단순히 Boolean 컨텍스트의 값을 확인
        expect(res._isEndCalled()).toBeTruthy();
    });

    it("should return json body in response", async () => {
        // mock함수가 어떤 값을 return 할지 직접 명시
        productModel.create.mockReturnValue(newProduct);
        await productController.createProduct(req, res, next);
        // _getJSONData - JSON 타입의 결과값을 참조
        expect(res._getJSONData()).toStrictEqual(newProduct);
    });

    it("should be handle errors", async () => {
        const errorMessage = { message: "description property missing" };
        // 비동기 요청에 대한 결과 값 성공 - Promise.resolve(value), 실패 - Promise.reject(reason)
        const rejectedPromise = Promise.reject(errorMessage);
        productModel.create.mockReturnValue(rejectedPromise);
        await productController.createProduct(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
});

describe("Product Controller Get", () => {
    it("should have a getProducts function", () => {
        expect(typeof productController.getProducts).toBe("function");
    });

    it("should call ProductModel.find({})", async () => {
        await productController.getProducts(req, res, next);
        expect(productModel.find).toBeCalledWith({});
    });

    it("should return 200 response", async () => {
        await productController.getProducts(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled).toBeTruthy();
    });

    it("should return json body in response", async () => {
        productModel.find.mockReturnValue(allProducts);
        await productController.getProducts(req, res, next);
        expect(res._getJSONData()).toStrictEqual(allProducts);
    });

    it("should handle errors", async () => {
        const errorMessage = { message: "Error finding product data" };
        const rejectedPromise = Promise.reject(errorMessage);
        productModel.find.mockReturnValue(rejectedPromise);
        await productController.getProducts(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
});

describe("Product Controller GetById", () => {
    it("should have a getProductById function", async () => {
        expect(typeof productController.getProductsById).toBe("function");
    });

    it("should call productModel.findById", async () => {
        req.params.productId = productId;
        await productController.getProductsById(req, res, next);
        expect(productModel.findById).toBeCalledWith(productId);
    });

    it("should return 200 response code", async () => {
        productModel.findById.mockReturnValue(newProduct);
        await productController.getProductsById(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
    });

    it("should return json body in response", async () => {
        productModel.findById.mockReturnValue(newProduct);
        await productController.getProductsById(req, res, next);
        expect(res._getJSONData()).toStrictEqual(newProduct);
    });

    it("should return 404 when item doesnt exist", async () => {
        productModel.findById.mockReturnValue(null);
        await productController.getProductsById(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    });

    it("should handle errors", async () => {
        const errorMessage = { message: "error" };
        const rejectedPromise = Promise.reject(errorMessage);
        productModel.findById.mockReturnValue(rejectedPromise);
        await productController.getProductsById(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
});

describe("Product Controller Update", () => {
    it("should have a updateProduct function", () => {
        expect(typeof productController.updateProduct).toBe("function");
    });

    it("should call productModel.findByIdUpdate", async () => {
        req.params.productId = productId;
        req.body = { name: "updated name", description: "updated description" };

        await productController.updateProduct(req, res, next);
        expect(productModel.findByIdAndUpdate).toBeCalledWith(
            req.params.productId,
            req.body,
            { new: true },
        );
    });

    it("should return json body and response code 200", async () => {
        req.params.productId = productId;
        req.body = { name: "updated name", description: "updated description" };
        productModel.findByIdAndUpdate.mockReturnValue(updatedProduct);

        await productController.updateProduct(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(updatedProduct);
    });

    it("should handle 404 when item doesn't exist", async () => {
        productModel.findByIdAndUpdate.mockReturnValue(null);
        await productController.updateProduct(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    });

    it("should be handle errors", async () => {
        const errorMessage = { message: "Error" };
        const rejectedPromise = Promise.reject(errorMessage);
        productModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);

        await productController.updateProduct(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
});

describe("Product Controller Delete", () => {
    it("should have a deleteProduct function", async () => {
        expect(typeof productController.deleteProduct).toBe("function");
    });

    it("should call productModel.findByIdAndDelete", async () => {
        req.params.productId = productId;

        await productController.deleteProduct(req, res, next);
        expect(productModel.findByIdAndDelete).toBeCalledWith(productId);
    });

    it("should return 200 response", async () => {
        const deletedProduct = {
            name: "deletedProduct",
            description: "description",
            price: 10,
        };
        productModel.findByIdAndDelete.mockReturnValue(deletedProduct);

        await productController.deleteProduct(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(deletedProduct);
    });

    it("should handle 404 when item doesn't exist", async () => {
        productModel.findByIdAndDelete.mockReturnValue(null);

        await productController.deleteProduct(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    });

    it("should handle errors", async () => {
        const errorMessage = { message: "Error deleting" };
        const rejectedPromise = Promise.reject(errorMessage);
        productModel.findByIdAndDelete.mockReturnValue(rejectedPromise);

        await productController.deleteProduct(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    });
});
