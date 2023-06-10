export const haveProjectAccess = (prisma, project_id, email) => {
  console.log("haveProjectAccess", project_id, email);
  return prisma.projects.findFirst({
    where: {
      project_id: project_id,
      created_by: email,
    },
  });
};
