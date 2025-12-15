import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export class Modal extends Component<null> {
  private closeButton: HTMLElement;
  private content: HTMLElement;
  private escapeHandler: ((event: KeyboardEvent) => void) | null = null;
  private scrollY: number = 0;

  constructor(container: HTMLElement) {
    super(container);

    this.closeButton = ensureElement<HTMLElement>(".modal__close", this.container);
    this.content = ensureElement<HTMLElement>(".modal__content", this.container);

    this.closeButton.addEventListener("click", () => this.close());
    
    this.container.addEventListener("click", (event) => {
      if (event.target === this.container) {
        this.close();
      }
    });
  }

  open(content?: HTMLElement): void {
    if (this.isOpen()) {
      return;
    }
    
    if (content) {
      this.setContent(content);
    }
    this.container.classList.add("modal_active");
    
    // Блокировка скролла
    this.scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${this.scrollY}px`;
    document.body.style.left = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    
    this.escapeHandler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        this.close();
      }
    };
    document.addEventListener('keydown', this.escapeHandler);
  }

  close(): void {
    if (!this.isOpen()) {
      return;
    }
    
    this.container.classList.remove("modal_active");
    
    // Восстановление скролла
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    window.scrollTo(0, this.scrollY);
    
    if (this.escapeHandler) {
      document.removeEventListener('keydown', this.escapeHandler);
      this.escapeHandler = null;
    }
  }

  isOpen(): boolean {
    return this.container.classList.contains("modal_active");
  }

  setContent(content: HTMLElement): void {
    this.content.innerHTML = "";
    this.content.appendChild(content);
  }

  getContent(): HTMLElement | null {
    return this.content.firstElementChild as HTMLElement;
  }

  render(): HTMLElement {
    return this.container;
  }
}