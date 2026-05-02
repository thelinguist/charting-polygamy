class MockResizeObserver {
    private callback: ResizeObserverCallback

    constructor(callback: ResizeObserverCallback) {
        this.callback = callback
    }

    observe(el: Element) {
        this.callback([{ contentRect: { width: 800 } } as ResizeObserverEntry], this)
    }

    unobserve() {}
    disconnect() {}
}

global.ResizeObserver = MockResizeObserver
