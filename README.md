# Babylon.js .obj File Loader

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
## Good things to know
* Your model doesn't have to be triangulated, as this loader will do it automatically.
* A Babylon.Mesh will be created for each object/group
* The obj model should be exported with -Z axis forward, and Y axis upward to be compatible with Babylon.js

## Not supported currently
* Multimaterial for a same object/group 
    * To be implemented: a new BABYLON.Mesh is created for each sub-mesh of the current object/group
* Smoothing groups

