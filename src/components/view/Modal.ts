// Модальное окно приложения
export class Modal {
  private closeBtn: HTMLElement;
  private content: HTMLElement;
  private escapeHandler: ((event: KeyboardEvent) => void) | null = null;
  private scrollLocked: boolean = false;

  constructor(private container: HTMLElement) {
    this.closeBtn = container.querySelector('.modal__close')!;
    this.content = container.querySelector('.modal__content')!;

    this.closeBtn.addEventListener('click', () => this.close());

    this.container.addEventListener('click', (event) => {
      if (event.target === this.container) {
        this.close();
      }
    });
  }

  open(content: HTMLElement) {
    this.setContent(content);
    this.container.classList.add('modal_active');
    
    this.lockScroll();
    
    this.escapeHandler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        this.close();
      }
    };
    document.addEventListener('keydown', this.escapeHandler);
  }

  close() {
    this.container.classList.remove('modal_active');
    
    this.unlockScroll();
    
    if (this.escapeHandler) {
      document.removeEventListener('keydown', this.escapeHandler);
      this.escapeHandler = null;
    }
  }

  setContent(content: HTMLElement) {
    this.content.innerHTML = ''
    this.content.appendChild(content);
  }

  private lockScroll(): void {
    if (this.scrollLocked) return;
    
    this.scrollLocked = true;
    
    document.body.style.overflow = 'hidden';
    
    const hasScrollbar = document.body.scrollHeight > window.innerHeight;
    if (hasScrollbar) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
  }

  private unlockScroll(): void {
    if (!this.scrollLocked) return;
    
    this.scrollLocked = false;
    
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }

  isOpen(): boolean {
    return this.container.classList.contains('modal_active');
  }
}