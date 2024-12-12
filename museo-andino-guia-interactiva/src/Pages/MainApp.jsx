// Importaciones necesarias
import React, { useEffect, useState } from "react"; // React para manejar el estado y los efectos
import { Header as CustomHeader } from "../Components/Header"; // Renombramos el componente Header para evitar conflictos con Ant Design
import { Breadcrumb, Layout, Menu, theme } from "antd"; // Componentes y tema de Ant Design
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons"; // Iconos de Ant Design
import toast, { Toaster } from "react-hot-toast"; // Librería para mostrar notificaciones
import { ChakraProvider, extendTheme } from "@chakra-ui/react"; // Chakra UI para estilos personalizados
import { Nav } from "../Components/Nav"; // Componente de navegación
import { ListCard } from "../Components/ListCard"; // Componente de tarjetas
import { Info } from "./Info"; // Página de información
import { Inicio } from "./Inicio"; // Página de inicio
import { GuiaInteractiva } from "./GuiaInteractiva"; // Página interactiva
import { useNavigate } from "react-router-dom"; // Hook para manejar la navegación
import "../style.css"; // Estilos personalizados
import { FooterMuseo } from "../Components/FooterMuseo"; // Footer del sitio

// Desestructuración de los componentes de Layout
const { Header, Content, Footer, Sider } = Layout;

// Función para crear elementos del menú dinámicamente
function getItem(label, key, icon, children) {
  return { key, icon, children, label };
}

// Definición del menú del sidebar
const items = [
  getItem("Inicio", "1", <PieChartOutlined />),
  getItem("Recetas", "2", <DesktopOutlined />),
  getItem("Informarse", "3", <UserOutlined />),
  getItem("Ejercitarse", "4", <TeamOutlined />),
  getItem("Administración", "5", <FileOutlined />, [
    getItem("Patología", "6"),
    getItem("Recetas", "7"),
    getItem("Información", "8"),
    getItem("Ejercicio", "9"),
    getItem("Usuario", "10"),
    getItem("Paciente", "11"),
    getItem("Categorías", "12"),
  ]),
  getItem("Tablas", "13", <FileOutlined />),
  getItem("Conversor Un.Med.", "14", <FileOutlined />),
];

// Tema personalizado para Chakra UI
const customTheme = extendTheme({
  components: {
    Form: {
      variants: {
        floating: {
          container: {
            _focusWithin: {
              label: { transform: "scale(0.85) translateY(-24px)" },
            },
            "input:not(:placeholder-shown) + label, textarea:not(:placeholder-shown) ~ label": {
              transform: "scale(0.85) translateY(-24px)",
            },
            label: { position: "absolute", top: 0, left: 0 },
          },
        },
      },
    },
  },
});

export const MainApp = () => {
  const [collapsed, setCollapsed] = useState(true); // Estado para manejar el colapso del sidebar
  const [selectedKey, setSelectedKey] = useState("1"); // Clave seleccionada del menú
  const [token, setToken] = useState(null); // Estado para el token JWT
  const [validatedToken, setValidatedToken] = useState(false); // Validación del token
  const navigate = useNavigate(); // Hook para navegación

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken(); // Tokens de estilo de Ant Design

  // Función para manejar clics en el menú
  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
  };

  // Función para parsear el token JWT
  const parseJwt = (token) => {
    if (!token) return null;
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(window.atob(base64));
    } catch {
      return null;
    }
  };

  // Efecto para obtener el token del local storage
  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");
    setToken(parseJwt(tokenFromStorage));
  }, []);

  // Mostrar el sidebar con botón "collapsible"
  return (
    <ChakraProvider theme={customTheme}>
      <Layout style={{ minHeight: "100vh" }}>
        <Toaster position="top-center" />
        <Sider
          collapsible // Habilita colapsar el sidebar
          collapsed={collapsed} // Estado del colapso
          onCollapse={(value) => setCollapsed(value)} // Evento para cambiar estado
          style={{
            backgroundColor: "#3e4b51",
            position: "fixed",
            zIndex: 1,
            height: "100vh",
          }}
        >
          <Menu
            theme="dark"
            defaultSelectedKeys={["1"]}
            mode="inline"
            items={items}
            onClick={handleMenuClick}
          />
        </Sider>
        <Layout>
          <CustomHeader setSelectedKey={setSelectedKey} />
          <Content style={{ margin: "16px" }}>
          {selectedKey === "1" && (
                <main className="main_home">
                  <img src="/fondo.jpg" className="img_fondo" alt="" />

                  <ListCard
                    setTabIndex={(index) => setSelectedKey(index.toString())}
                  />
                </main>
              )}
            {selectedKey === "2" && <Inicio />}
            {selectedKey === "3" && <ListCard />}
          </Content>
        </Layout>
      </Layout>
    </ChakraProvider>
  );
};
