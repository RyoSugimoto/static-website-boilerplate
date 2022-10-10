import Drawer from '../libraries/drawer-module'

// ================
// ドロワー

const drawer = new Drawer({
  drawer: '#drawer',
  switch: '[data-drawer-trigger]',
  inert: '[data-drawer-inert]',
})

// 画面のリサイズ時にドロワーを閉じる。

window.addEventListener('resize', () => {
  if (drawer.isExpanded) {
    drawer.close()
  }
})

// ドロワーの中のリンクをクリックするとドロワーを閉じる。

const drawerElement = drawer.drawerElement

if (drawerElement) {
  const linksInDrawer = drawer.drawerElement.querySelectorAll('a')
  if (linksInDrawer.length !== 0) {
    for (let link of linksInDrawer) {
      link.addEventListener('click', () => {
        if (drawer.isExpanded) {
          drawer.close()
        }
      })
    }
  }
}
