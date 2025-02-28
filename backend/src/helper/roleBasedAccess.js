export const checkPermission = (requiredPermissions) => {
    return async (req, res, next) => {
      const userId = req.user.id; // Assume JWT decoded user ID
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } } }
      });
  
      if (!user) return res.status(403).json({ message: "User not found" });
  
      const userPermissions = user.roles.flatMap(role => role.role.permissions.map(p => p.permission.name));
  
      const hasPermission = requiredPermissions.every(p => userPermissions.includes(p));
      if (!hasPermission) return res.status(403).json({ message: "Access denied" });
  
      next();
    };
  };