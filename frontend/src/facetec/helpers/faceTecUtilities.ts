export function displayStatus(message: string): void {
  document.getElementById('status')!.innerHTML = message
}

export function showMainUI(): void {
  ;(
    document.querySelector('.wrapping-box-container') as HTMLElement
  ).style.opacity = '1'
}

export function disableAllButtons() {
  document.querySelectorAll('button').forEach(function (button) {
    button.disabled = true
  })
}

export function fadeOutMainUIAndPrepareForSession() {
  disableAllButtons()
  ;(
    document.querySelector('.wrapping-box-container') as HTMLElement
  ).style.opacity = '0'
}

export function enableAllButtons() {
  document.querySelectorAll('button').forEach(function (button) {
    button.disabled = false
  })
}

export function handleErrorGettingServerSessionToken() {
  showMainUI()
  enableAllButtons()
  displayStatus(
    'Não foi possível iniciar a sessão devido a um problema inesperado durante o pedido de rede.',
  )
}

export function generateUUId() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16),
  )
}

export function formatUIForDevice() {
  if (isLikelyMobileDevice()) {
    document
      .querySelectorAll<HTMLElement>('.controls > button')
      .forEach(function (element) {
        if (element.className === 'big-button') {
          element.style.height = '40px'
          element.style.fontSize = '18px'
        } else if (element.className === 'medium-button') {
          element.style.height = '30px'
          element.style.fontSize = '14px'
        }

        element.style.width = '220px'
      })

    document.getElementById('controls')!.style.borderColor = 'transparent'
    document.getElementById('status')!.style.backgroundColor = 'transparent'
    document.getElementById('status')!.style.fontSize = '12px'
    document
      .getElementById('custom-logo-container')!
      .parentNode!.insertBefore(
        document.getElementById('custom-logo-container')!,
        document.getElementById('custom-logo-container')!.parentNode!
          .firstChild,
      )
    document.getElementById('custom-logo-container')!.style.margin = '0 auto'
    document.querySelector<HTMLElement>(
      '#custom-logo-container img',
    )!.style.height = '55px'
    ;(
      document.getElementsByClassName(
        'wrapping-box-container',
      )[0] as HTMLElement
    ).style.left = '50%'
    ;(
      document.getElementsByClassName(
        'wrapping-box-container',
      )[0] as HTMLElement
    ).style.transform = 'translate(-50%, -50%)'
  }
}

export function isLikelyMobileDevice() {
  let isMobileDeviceUA =
    !!/Android|iPhone|iPad|iPod|IEMobile|Mobile|mobile/i.test(
      navigator.userAgent || '',
    )
  if (
    isMobileDeviceUA &&
    (navigator.userAgent.indexOf('CrOS') !== -1 ||
      navigator.userAgent.indexOf('Chromebook') !== -1)
  ) {
    isMobileDeviceUA = false
  }
  if (screen.width < screen.height || isMobileDeviceUA) {
    return true
  } else {
    return false
  }
}
