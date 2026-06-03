export const enhanceRouteHandler = (handler: any) => async (req: any, ctx: any) => {
  const body = await req.json().catch(() => ({}));
  return handler({ body, user: null });
};
