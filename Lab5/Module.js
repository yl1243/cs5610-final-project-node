const module = {
    id: "1",
    name: "module one",
    description: "this is a module",
    course: "web dev",
};

export default function Module(app) {
    app.get("/lab5/module", (req, res) => {
        res.json(module);
    });

    app.get("/lab5/module/name", (req, res) => {
        res.json(module.name);
    });

    app.get("/lab5/module/name/:newModuleName", (req, res) => {
        const { newModuleName } = req.params;
        module.name = newModuleName;

        res.json(module);
    });

    app.get("/lab5/module/score/:newModuleScore", (req, res) => {
        const { newModuleScore } = req.params;
        module.score = newModuleScore;

        res.json(module);
    });

    app.get("/lab5/module/completed/:newModuleCompleted", (req, res) => {
        const { newModuleCompleted } = req.params;
        module.completed = newModuleCompleted;

        res.json(module);
    });

    app.get("/lab5/module/description/:newModuleDescription", (req, res) => {
        const { newModuleDescription } = req.params;
        module.description = newModuleDescription;

        res.json(module);
    });
}