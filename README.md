stylecow plugin msfilter-linear-gradient
========================================

Stylecow plugin to emulate the linear-gradient background in explorer < 9 using ms filters

You write:

```css
body {
	background-image: linear-gradient(to bottom, red, blue);
}
```

And stylecow converts to:

```css
body {
	background-image: linear-gradient(to bottom, red, blue);
	-ms-filter: 'progid:DXImageTransform.Microsoft.gradient(startColorStr="#FF0000", endColorStr="#0000FF")';
}
```
