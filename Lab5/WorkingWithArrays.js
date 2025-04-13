let todos =
    [{ id: 1, title: "Task 1", completed: false },
    { id: 2, title: "Task 2", completed: true },
    { id: 3, title: "Task 3", completed: false },
    { id: 4, title: "Task 4", completed: true },];

export default function WorkingWithArrays(app) {

    // Creating New Data in a Server
    app.get("/lab5/todos/create", (req, res) => {
        const newTodo = {
            id: new Date().getTime(),
            title: "New Task",
            completed: false,
        };
        todos.push(newTodo);
        res.json(todos);
    });

    // the HTTP POST method takes the role of the verb meaning create
    app.post("/lab5/todos", (req, res) => {
        const newTodo = { ...req.body, id: new Date().getTime() };
        todos.push(newTodo);
        res.json(newTodo);
    });



    // retrieve data by primary key
    app.get("/lab5/todos/:id", (req, res) => {
        const { id } = req.params;
        const todo = todos.find((t) => t.id === parseInt(id));
        if (todo) {
            res.json(todo);
        }
        else {
            res.json({ message: "Todo not found" });
        }
    });


    // filter
    app.get("/lab5/todos", (req, res) => {
        const { completed } = req.query;
        console.log("completed, ", completed);

        if (completed !== undefined) {
            const completedBool = completed === "true";
            const completedTodos = todos.filter((t) => t.completed === completedBool);
            res.json(completedTodos);

            return;
        }
        res.json(todos);
    });

    // Deleting Data from a Server
    app.get("/lab5/todos/:id/delete", (req, res) => {
        const { id } = req.params;
        const todo = todos.find((t) => t.id === parseInt(id));
        const todoIndex = todos.indexOf(todo);
        if (todoIndex !== -1) {
            todos.splice(todoIndex, 1);
        }
        res.json(todos);
    });

    // Deleting Data from Servers with HTTP DELETE Requests
    app.delete("/lab5/todos/:id", (req, res) => {
        const { id } = req.params;
        const todoIndex = todos.findIndex((t) => t.id === parseInt(id));

        // Handling Errors
        if (todoIndex === -1) {
            res.status(404).json({ message: `Unable to delete Todo with ID ${id}` });
            return;
        }


        todos.splice(todoIndex, 1);
        res.sendStatus(200);
    });


    // Updating Data on a Server
    app.get("/lab5/todos/:id/title/:title", (req, res) => {
        const { id, title } = req.params;
        const todo = todos.find((t) => t.id === parseInt(id));
        todo.title = title;
        res.json(todos);
    });


    // 更新 description
    app.get("/lab5/todos/:id/description/:description", (req, res) => {
        const { id, description } = req.params;
        const todo = todos.find((t) => t.id === parseInt(id));
        if (todo) {
            todo.description = description;
            res.json(todos);
        } else {
            res.json({ message: "Todo not found" });
        }
    });

    // 更新 completed 状态
    app.get("/lab5/todos/:id/completed/:completed", (req, res) => {
        const { id, completed } = req.params;
        const todo = todos.find((t) => t.id === parseInt(id));
        if (todo) {
            todo.completed = completed === "true"; // 字符串转 boolean
            res.json(todos);
        } else {
            res.json({ message: "Todo not found" });
        }
    });

    // Updating Data on Servers with HTTP PUT Requests
    app.put("/lab5/todos/:id", (req, res) => {
        const { id } = req.params;
        const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
        if (todoIndex === -1) {
            res.status(404).json({ message: `Unable to update Todo with ID ${id}` });
            return;
        }
        todos = todos.map((t) => {
            if (t.id === parseInt(id)) {
                return { ...t, ...req.body };
            }
            return t;
        });
        res.sendStatus(200);
    });





};
