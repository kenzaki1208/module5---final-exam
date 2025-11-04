import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/custom.css";

export default function ProductAdd() {
    const [product, setProduct] = useState({
        code: "",
        name: "",
        importDate: "",
        quantity: "",
        price: "",
        categoryId: "",
    });
    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:3001/categories").then((res) => setCategories(res.data));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({
            ...product,
            [name]:
                name === "categoryId" || name === "quantity" || name === "price"
                    ? Number(value)
                    : value,
        });
    };

    const validate = () => {
        const errs = {};
        const codeRegex = /^PROD-\d{4}$/;

        if (!product.code.trim()) errs.code = "Mã sản phẩm không được để trống!";
        else if (!codeRegex.test(product.code))
            errs.code = "Mã sản phẩm phải đúng định dạng PROD-XXXX!";

        if (!product.name.trim()) errs.name = "Tên sản phẩm không được để trống!";

        if (!product.importDate) errs.importDate = "Vui lòng chọn ngày nhập!";
        else if (new Date(product.importDate) > new Date())
            errs.importDate = "Ngày nhập không được lớn hơn ngày hiện tại!";

        if (!product.quantity) errs.quantity = "Vui lòng nhập số lượng!";
        else if (isNaN(product.quantity) || product.quantity <= 0 || !Number.isInteger(Number(product.quantity)))
            errs.quantity = "Số lượng phải là số nguyên lớn hơn 0!";

        if (!product.price) errs.price = "Vui lòng nhập giá!";
        else if (isNaN(product.price) || product.price <= 0)
            errs.price = "Giá phải là số lớn hơn 0!";

        if (!product.categoryId) errs.categoryId = "Vui lòng chọn loại sản phẩm!";

        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;

        await axios.post("http://localhost:3001/products", product);
        alert("✅ Thêm sản phẩm thành công!");
        navigate("/", { state: { refresh: true } });
    };

    return (
        <div className="container py-5 d-flex justify-content-center">
            <div className="card shadow-lg p-4 border-0 form-card">
                <h3 className="text-center text-primary fw-bold mb-4">🧾 Thêm sản phẩm mới</h3>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Mã sản phẩm</label>
                        <input
                            name="code"
                            value={product.code}
                            onChange={handleChange}
                            className={`form-control ${errors.code ? "is-invalid" : ""}`}
                        />
                        {errors.code && <div className="invalid-feedback">{errors.code}</div>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Tên sản phẩm</label>
                        <input
                            name="name"
                            value={product.name}
                            onChange={handleChange}
                            className={`form-control ${errors.name ? "is-invalid" : ""}`}
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Giá (₫)</label>
                        <input
                            type="number"
                            name="price"
                            value={product.price}
                            onChange={handleChange}
                            className={`form-control ${errors.price ? "is-invalid" : ""}`}
                        />
                        {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Số lượng</label>
                        <input
                            type="number"
                            name="quantity"
                            value={product.quantity}
                            onChange={handleChange}
                            className={`form-control ${errors.quantity ? "is-invalid" : ""}`}
                        />
                        {errors.quantity && <div className="invalid-feedback">{errors.quantity}</div>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Ngày nhập</label>
                        <input
                            type="date"
                            name="importDate"
                            value={product.importDate}
                            onChange={handleChange}
                            className={`form-control ${errors.importDate ? "is-invalid" : ""}`}
                        />
                        {errors.importDate && (
                            <div className="invalid-feedback">{errors.importDate}</div>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-semibold">Thể loại</label>
                        <select
                            name="categoryId"
                            value={product.categoryId}
                            onChange={handleChange}
                            className={`form-select ${errors.categoryId ? "is-invalid" : ""}`}
                        >
                            <option value="">-- Chọn loại --</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                        {errors.categoryId && (
                            <div className="invalid-feedback">{errors.categoryId}</div>
                        )}
                    </div>

                    <div className="d-flex justify-content-between">
                        <button type="button" className="btn btn-secondary px-4" onClick={() => navigate("/")}>
                            ⬅ Quay lại
                        </button>
                        <button type="submit" className="btn btn-success px-4 btn-animated">
                            ➕ Thêm sản phẩm
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}