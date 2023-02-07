import { useNavigate } from "react-router-dom";
import { Logo } from "../component/Logo";
import React, { useState, useEffect, useContext} from "react";
import { products } from "./items1";
import { sendEmail } from "../service/emailService";
import { Context } from "../store/appContext";

const categories = ["repuestos", "neumaticos", "accesorios"];

const Categorias = [
  {
    nombre: "Todos los productos",
    articulos: [
      "frenos",
      "manubrio",
      "parches",
      "cadenas",
      "neumaticos",
      "sillin",
      "casco",
      "puño",
      "punteras",
    ],
  },
  {
    nombre: "repuestos",
    articulos: ["frenos", "manubrio", "parches", "cadenas", "neumaticos"],
  },
  {
    nombre: "accesorios",
    articulos: ["sillin", "casco", "puño", "punteras"],
  },
  {
    nombre: "suplementos",
    articulos: ["creatina", "proteinas", "aminoacidos", "barras energeticas"],
  },
];

export const UserStore = () => {
  const navigate = useNavigate();
  const url = process.env.BACKEND_URL;

  const [idArticulos, setIdArticulos] = useState(-1);
  const [category, setCategory] = useState("");
  const [subcategorySelected, setSubcategorySelected] = useState("");
  const [subcategories, setSubCategories] = useState([]);
  const [actualIndex, setActualIndex] = useState(0);
  const { store, actions } = useContext(Context)
  const [actualItem, setActualItem] = useState({
    id: -1,
    category: "",
    product: "",
    name: "",
    price: 0,
    img: "",
  });
  const [item, setItem] = useState({
    id: -1,
    category: "",
    product: "",
    name: "",
    price: 0,
    img: "",
  });

  const filterSubcategories = (data = { target: { value: "repuestos" } }) => {
    //console.log(data.target.value);
    setCategory(data.target.value);
    const items = products.filter((p) => p.category == data.target.value);
    //console.log(items);
    const subcategories = [];
    for (var i = 0; i < items.length; i++) {
      //console.log(items[i]);
      const founded =
        subcategories.findIndex((e) => e == items[i].subcategory) == -1;
      if (founded) {
        subcategories.push(items[i].subcategory);
      }
    }
    //console.log(subcategories);
    setSubCategories([...subcategories]);
    handleProduct({ target: { value: subcategories.length>0? subcategories[0]:""} })
  };

  const handleProduct = (value = { target: { value: "freno" } }) => {
    setSubcategorySelected(value.target.value);
    const items = products.filter((p) => p.subcategory == value.target.value);
    setItem([...items]);
    //setActualIndex(0);
    //setActualItem(items[0]);
    console.log(items);
  };

  const nextItem = () => {
    //console.log(actualIndex);
    //console.log(item.length);
    if (actualIndex + 1 < item.length) {
      const a = actualIndex + 1;
      setActualIndex(a);
      setActualItem(item[a]);
      //console.log(item[a]);
    }
  };

  const prevItem = () => {
    // console.log(actualIndex);
    if (actualIndex - 1 > -1) {
      setActualIndex(actualIndex - 1);
      setActualItem(item[actualIndex - 1]);
    }
  };
  useEffect(() => {
    filterSubcategories();
    handleProduct();
  }, []);

  const getUserById = async (id) => {
    const response = await fetch(`${url}/api/users/${id}`);
    const data = await response.json();   
    return data
  }
  const addToCar = async (item) => {
    console.log("creando orden de compra" + item.name);
    const wsUser = await getUserById(item.user_id);
    sendEmail({to_email:wsUser.email,templateId:"template_5ik8dgo", from_name:store.user.id})
    

  };

  return (
    <form className="contenedor-login">
      <div className="mb-3">
        <div className="nombre-tienda">
          <Logo />
        </div>
        <div className="carrito"></div>

        <select
          name="categorias"
          id="selCategoria"
          onChange={(e) => filterSubcategories(e)}
          value={category}
          className="form-select"
          aria-label="Default select example"
        >
          {categories.map((p, index) => (
            <option value={p} key={index + 100}>
              {p}
            </option>
          ))}
        </select>

        <select
          name="articulos"
          id="selarticulos"
          onChange={handleProduct}
          className="form-select"
          aria-label="Default select example"
          value={subcategorySelected}
        >
          {category != "" &&
            subcategories.map((i, index) => (
              <option value={i} key={index + 100}>
                {i}
              </option>
            ))}
        </select>
        <div
          id="carouselExampleControls"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            {item != null && item.length > 0 ? (
              item.map((m, index) => (
                <div
                  className={
                    "carousel-item " + (index === actualIndex ? "active" : "") //arreglo de parentesis
                  }
                  key={index + 10}
                >
                  <img src={m.img} alt={m.name} className="d-block w-100" />
                  <div class="carousel-caption">
                    <h3>{m.name}</h3>
                    <p>{m.price}</p>
                    <button
                      type="button"
                      onClick={() => addToCar(m)} // llamar a la función addToCar()
                      className="btn btn-dark"
                    >
                      Comprar
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div></div>
            )}
          </div>

          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleControls"
            data-bs-slide="prev"
            onClick={prevItem}
          >
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleControls"
            data-bs-slide="next"
            onClick={nextItem}
          >
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
        {/*<div className="row">
          <div>{actualItem.name}</div>
          <div>{actualItem.price}</div>
            </div>*/}
      </div>
    </form>
  );
};
