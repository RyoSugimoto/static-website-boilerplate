import ObjectFitImages from 'object-fit-images'

// ================
// IEのときの処理

const isIe = document.documentMode
if (isIe) {
  // CSSのobject-fitプロパティのポリフィルを実行
  ObjectFitImages()
}
