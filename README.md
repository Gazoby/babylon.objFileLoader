## obj File Loader

To use it, you just have to reference the loader file:

```
<script src="babylon.2.1.js"></script>
<script src="babylon.objFileLoader.js"></script>
```

Babylon.js will know how to load the obj file and its mtl file automatically: 
```
BABYLON.SceneLoader.Load("/assets/", "batman.obj", engine, function (newScene) { 
   newScene.activeCamera.attachControl(canvas, false);
   engine.runRenderLoop(function () { 
       newScene.render(); 
   }); 
});
```
#What is supported