// registers a webhook to Lasse's service
fetch("https://lasse.loca.lt", {
  method: "post",
  body: JSON.stringify({
    url: "https://doro-hd.loca.lt/lasse",
    events: ["payment_processed", "invoice_payed"],
  }),
});
