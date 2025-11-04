import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../assets/custom.css";

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const location = useLocation();

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (location.state?.refresh) {
            loadData();
        }
    }, [location]);

    const sortByName = (arr) => arr.sort((a, b) => a.name.localeCompare(b.name, "vi"));

    const loadData = async () => {
        const proRes = await axios.get("http://localhost:3001/products");
        const catRes = await axios.get("http://localhost:3001/categories");
        setProducts(sortByName(proRes.data));
        setCategories(catRes.data);
    };

    const handleSearch = async () => {
        const res = await axios.get("http://localhost:3001/products");
        let filtered = res.data;

        const normalize = (str) =>
            str
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");

        if (keyword.trim()) {
            const kw = normalize(keyword.trim());
            filtered = filtered.filter((p) => normalize(p.name).includes(kw));
        }

        if (categoryId) {
            filtered = filtered.filter((p) => p.categoryId === Number(categoryId));
        }

        setProducts(sortByName(filtered));
    };

    return (
        <div className="container py-4">
            <h2
                className="text-center mb-4 fw-bold text-light py-3 rounded shadow-sm"
                style={{
                    background: "linear-gradient(90deg, #007bff, #00c6ff)",
                }}
            >
                💊 Danh sách sản phẩm
            </h2>

            <div className="d-flex flex-wrap align-items-center mb-4 gap-2">
                <div className="input-group flex-grow-1 shadow-sm">
                    <span className="input-group-text bg-primary text-white">
                        <i className="bi bi-search"></i>
                    </span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm theo tên sản phẩm..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>

                <select
                    className="form-select shadow-sm w-auto"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                >
                    <option value="">-- Chọn loại --</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>

                <button className="btn btn-primary shadow-sm px-4 fw-semibold" onClick={handleSearch}>
                    🔍 Tìm kiếm
                </button>

                <Link to="/add">
                    <button className="btn btn-success ms-2 shadow-sm px-4 fw-semibold">
                        ➕ Thêm sản phẩm
                    </button>
                </Link>
            </div>

            {products.length === 0 ? (
                <p className="text-danger fw-semibold text-center fs-5">Không có kết quả!</p>
            ) : (
                <div className="card shadow-sm border-0">
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-primary text-center">
                                    <tr>
                                        <th>STT</th>
                                        <th>Mã SP</th>
                                        <th>Tên SP</th>
                                        <th>Thể loại</th>
                                        <th>Số lượng</th>
                                        <th>Giá</th>
                                        <th>Ngày nhập</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((p, index) => (
                                        <tr key={p.id}>
                                            <td className="text-center">{index + 1}</td>
                                            <td className="text-center">{p.code}</td>
                                            <td>{p.name}</td>
                                            <td className="text-center">
                                                {categories.find((c) => Number(c.id) === p.categoryId)?.name}
                                            </td>
                                            <td className="text-center">{p.quantity}</td>
                                            <td className="text-center text-success fw-semibold">
                                                {p.price.toLocaleString("vi-VN")} ₫
                                            </td>
                                            <td className="text-center">
                                                {new Date(p.importDate).toLocaleDateString("vi-VN")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            <p className="text-center mb-0 mt-4 p-0">&copy; CodeGym 2025</p>
        </div>
    );
}