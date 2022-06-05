import Chessboard from "./Chessboard";

class InputListener {
  private inputEl: HTMLInputElement;
  private retryButton: HTMLDivElement;
  private chessboard: Chessboard | null = null;

  constructor(chessboard: Chessboard, inputElement: HTMLInputElement, retryButton: HTMLDivElement) {
    this.chessboard = chessboard;
    this.inputEl = inputElement;
    this.retryButton = retryButton;
    this.addEventListeners();
  }

  private addEventListeners() {
    this.inputEl.addEventListener('change', this.inputElListener.bind(this));
    this.retryButton.addEventListener('click', this.retryButtonListener.bind(this));
  }

  private inputElListener(e: Event) {
    this.chessboard?.notifySizeChange(parseInt((e.target as HTMLInputElement)?.value));
  }

  private retryButtonListener(e: Event) {
    this.chessboard?.notifyRetry();
  }
}

export default InputListener;
