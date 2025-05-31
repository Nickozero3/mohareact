import ListarProductos from "./ListarProductos";

const adminPanel = () => {
    return (
       <div>
        <div className="admin-panel">
            <h1 className="text-2xl font-bold mb-4">Panel de Administración de Productos</h1>

        </div>
            <ListarProductos />
        
       </div>
    );
    }

export default adminPanel;
