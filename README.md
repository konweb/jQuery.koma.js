# jQuery.koma.js

Frame advance animation plugin.

## Demo
- [http://konweb.github.io/jQuery.koma.js/demo/](http://konweb.github.io/jQuery.koma.js/demo/)

## Get started
### HTML
```html
<!DOCTYPE html>
<html lang="en">
<head>
	<link rel="stylesheet" href="./css/marx.min.css">
	<script src="//code.jquery.com/jquery-2.1.3.min.js"></script>
	<script src="./js/jquery.koma.min.js"></script>
</head>
<body>
	<div class="js-koma">
		<div class="img-wrap koma-items">
			<img src="./images/image1.png">
			<img src="./images/image2.png">
			<img src="./images/image3.png">
			...
		</div>
	</div>
</body>
</html>
```

### CSS
```css
.image-wrap{
	position: relative;
	height: 240px;
}
.image-wrap img{
	position: absolute;
}
```

### JS
```js
<script>
	$(function(){
		$('.hoge').koma();
	});
</script>
```

## Options

| option | description | default |
|:---|:---|:---|
| fps | アニメーションのFPS | 20 |
| step | - | null |
| itemEl | 画像を囲うclass名 | '.koma-items' |
| restartEl | 再スタートボタンclass名 | '.koma-restart' |
| stopEl | ストップボタンclass名 | '.koma-stop' |
