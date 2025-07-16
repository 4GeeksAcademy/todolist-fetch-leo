import React, { useEffect, useState } from "react";

const username = "kaito";

const Todolist = () => {
	const [lista, setLista] = useState([]);
	const [tarea, setTarea] = useState("");

	// Crear usuario al iniciar
	useEffect(() => {
		fetch(`https://playground.4geeks.com/todo/users/${username}`, {
			method: "POST",
			body: JSON.stringify([]),
			headers: { "Content-Type": "application/json" }
		})
			.then((resp) => {
				if (resp.ok || resp.status === 400) {
					
					cargarTareas();
				} else {
					console.error("Error creando usuario:", resp.status);
				}
			})
			.catch((error) => console.error("Error creando usuario:", error));
	}, []);

	// Obtener tareas
	const cargarTareas = () => {
		fetch(`https://playground.4geeks.com/todo/users/${username}`)
			.then((res) => res.json())
			.then((data) => {
				if (Array.isArray(data.todos)) {
					setLista(data.todos);
				} else {
					console.error("Respuesta no válida:", data);
				}
			})
			.catch((error) => console.error("Error cargando tareas:", error));
	};

	
	const agregarTarea = (e) => {
		if (e.key === "Enter" && tarea.trim() !== "") {
			const nuevaTarea = { label: tarea.trim(), done: false };
			const nuevaLista = [...lista, nuevaTarea];

			fetch(`https://playground.4geeks.com/todo/todos/${username}`, {
				method: "POST",
				body: JSON.stringify(nuevaTarea),
				headers: { "Content-Type": "application/json" }
			})
				.then((res) => {
					if (res.ok) {
						setTarea("");
						cargarTareas();
					}
				})
				.catch((err) => console.error("Error al agregar tarea:", err));
		}
	};

	// Eliminar tarea 
	const eliminarTarea = (id) => {
	fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
		method: "DELETE"
	})
		.then((res) => {
			if (res.ok) {
				cargarTareas();
			} else {
				console.error("Error eliminando tarea:", res.status);
			}
		})
		.catch((err) => console.error("Error al eliminar tarea:", err));
};

	

	return (
		<div className="container mt-5" style={{ maxWidth: "500px" }}>
			<div className="card shadow p-4">
				<h1 className="text-danger-emphasis text-center">Todos</h1>
				<input
					type="text"
					className="form-control mt-3"
					placeholder="Escribe una tarea y presiona Enter"
					value={tarea}
					onChange={(e) => setTarea(e.target.value)}
					onKeyDown={agregarTarea}
				/>
			</div>

			<div className="list-group mt-3">
				{lista.length === 0 ? (
					<p className="text-center">No hay tareas</p>
				) : (
					lista.map((t, i) => (
						<div key={i} className="list-group-item">
							{t.label}
							<button
								className="btn btn-sm btn-danger float-end"
								onClick={() => eliminarTarea(t.id)}
							>
								Borrar
							</button>
						</div>
					))
				)}
			</div>

			
		</div>
	);
};

export default Todolist;
