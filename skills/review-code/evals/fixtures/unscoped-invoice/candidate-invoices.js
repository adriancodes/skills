export function registerInvoiceRoutes(app, db, requireUser) {
  app.get("/invoices", requireUser, async (req, res) => {
    res.json(await db.invoices.findMany({ where: { accountId: req.user.accountId } }));
  });

  app.get("/invoices/:id", requireUser, async (req, res) => {
    const invoice = await db.invoices.findUnique({ where: { id: req.params.id } });
    if (!invoice) return res.status(404).end();
    res.json(invoice);
  });
}
