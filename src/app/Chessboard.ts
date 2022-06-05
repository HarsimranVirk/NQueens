import Logger from "./Logger";

class Chessboard {
  public static MAX_SIZE = 9;
  public static MIN_SIZE = 4;
  public static TIMEOUT_MULT = 200;

  private size = 4;
  private div: HTMLDivElement | null = null;
  private solutions: string[][] = new Array();
  private mapIndex: Map<number, number> = new Map();
  private clickListenerActivate = true;
  private queens: HTMLSpanElement[] = new Array();

  constructor(attachToDiv: HTMLDivElement) {
    this.div = attachToDiv;
    this.notifySizeChange(4);
  }

  public getSize() {
    return this.size;
  }

  public notifySizeChange(size: number) {
    if (size >= Chessboard.MIN_SIZE && size <= Chessboard.MAX_SIZE) {
      this.size = size;
      this.clickListenerActivate = true;
      Logger.log(`Size ${this.size}`);
      this.solve();
      this.renderChessboard();
    }
  }

  public notifyRetry() {
    this.queens.forEach((queen) => (queen.style.opacity = "0"));
    this.clickListenerActivate = true;
  }

  public solve() {
    this.solutions.length = 0;

    const size = this.size;

    const pSol: string[] = new Array();

    for (let i = 0; i < size; i++) {
      pSol.push(".".repeat(size));
    }

    this._solve(0, Array.from(pSol));
    this._indexSolution();
  }

  private _solve(row: number, pSol: string[]) {
    if (row === this.size) {
      this.solutions.push(pSol);
      return;
    }

    for (let i = 0; i < this.size; i++) {
      if (this._isValid(row, i, pSol)) {
        const newPSol = Array.from(pSol);
        newPSol[row] = ".".repeat(i) + "q" + ".".repeat(this.size - i - 1);
        this._solve(row + 1, newPSol);
      }
    }
  }

  private _isValid(row: number, col: number, pSol: string[]) {
    for (let i = 0; row - i >= 0; i++) {
      if (pSol[i][col] === "q") return false;
      if (col - i >= 0 && pSol[row - i][col - i] === "q") return false;
      if (col + i < this.size && pSol[row - i][col + i] === "q") return false;
    }

    return true;
  }

  private _indexSolution() {
    const size = this.size;
    this.solutions.map((sol, idx) => {
      sol.map((row, rid) => {
        for (let i = 0; i < size; i++)
          if (row[i] === "q") this.mapIndex.set(size * rid + i, idx);
      });
    });
  }

  public renderChessboard() {
    if (this.div !== null) {
      const size = this.size;
      this.div.replaceChildren();
      this.queens.length = 0;
      this.div.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;
      this.div.style.gridTemplateRows = `repeat(${this.size}, 1fr)`;
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          const el = document.createElement("div");
          if (this.mapIndex.get(row * size + col)) {
            el.className = "green cell";
          } else {
            el.className = "red cell";
          }
          this.div.appendChild(el);
          const queenEl = document.createElement("span");
          this.queens.push(queenEl);
          if (queenEl) {
            el.replaceChildren();
            queenEl.className = "queen";
            el.appendChild(queenEl);
          }
          el.addEventListener("click", (ev) =>
            this.cellClickListener(ev, row, col)
          );
        }
      }
    }
  }

  private showDominoEffect(row: number, col: number, timeoutRank: number) {
    const size = this.size;
    setTimeout(
      () => (this.queens[size * row + col].style.opacity = "1"),
      timeoutRank * Chessboard.TIMEOUT_MULT
    );
  }

  private cellClickListener(ev: Event, row: number, col: number) {
    if (this.clickListenerActivate) {
      const idx = this.mapIndex.get(this.size * row + col);
      if (idx) {
        this.clickListenerActivate = false;
        const size = this.size;
        const sol = this.solutions[idx];
        for (let i = 0; i < size; i++) {
          for (let j = 0; j < size; j++) {
            if (row + i < size && sol[row + i][j] == "q")
              this.showDominoEffect(row + i, j, i);
            if (row - i >= 0 && sol[row - i][j] == "q")
              this.showDominoEffect(row - i, j, i);
          }
        }
      }
    }
  }
}

export default Chessboard;
