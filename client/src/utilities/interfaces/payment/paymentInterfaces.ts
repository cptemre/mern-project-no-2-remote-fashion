interface AcceptableCurrinciesInterface {
  GBP: "&#163;";
  USD: "&#36;";
  PLN: "&#122;&#322;";
  EURO: "&#36;";
}

type SelectedCurrencyType = keyof AcceptableCurrinciesInterface;

export type { AcceptableCurrinciesInterface, SelectedCurrencyType };
