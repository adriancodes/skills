export function registerInvoiceRoutes(app, db, requireUser) {
  app.get("/invoices", requireUser, async (req, res) => {
    res.json(await db.invoices.findMany({ where: { accountId: req.user.accountId } }));
  });
}
