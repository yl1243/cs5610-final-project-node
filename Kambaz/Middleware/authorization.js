// 你只需要提供一个中间件 requireRole("STUDENT") 并指导 Quiz 组使用你的权限控制中间件，
// 在 quiz 的 routes.js 文件中保护接口

export const requireRole = (role) => (req, res, next) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser || currentUser.role !== role) {
        return res.status(403).json({ message: `Access denied. ${role} only.` });
    }
    next();
};