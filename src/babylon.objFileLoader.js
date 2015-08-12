/// <reference path="../References/babylon.2.1.d.ts"/>
/// <reference path="../References/waa.d.ts"/>
var BABYLON;
(function (BABYLON) {
    /**
     * Class reading and parsing the MTL file bundled with the obj file.
     */
    var MTLFileLoader = (function () {
        function MTLFileLoader() {
            // All material loaded from the mtl
            this.materials = [];
            this.parseMTL = function (scene, data, rootUrl) {
                //Split the lines from the file
                var lines = data.split('\n');
                var delimiter_pattern = /\s+/;
                var color;
                var material;
                for (var i = 0; i < lines.length; i++) {
                    var line = lines[i];
                    line = line.trim();
                    // Blank line or comment
                    if (line.length === 0 || line.charAt(0) === '#') {
                        continue;
                    }
                    //Get the first parameter (keyword)
                    var pos = line.indexOf(' ');
                    var key = (pos >= 0) ? line.substring(0, pos) : line;
                    key = key.toLowerCase();
                    //Get the data following the key
                    var value = (pos >= 0) ? line.substring(pos + 1) : "";
                    value = value.trim();
                    //Create the new material
                    if (key === "newmtl") {
                        //Add the previous material in an array
                        if (material) {
                            this.materials.push(material);
                        }
                        //Create a new material
                        material = new BABYLON.StandardMaterial(value, scene);
                    }
                    else if (key === "kd") {
                        // Diffuse color (color under white light) using RGB values
                        color = value.split(delimiter_pattern, 3);
                        material.diffuseColor = BABYLON.Color3.FromArray(color);
                    }
                    else if (key === "ka") {
                        // Ambient color (color under shadow) using RGB values
                        color = value.split(delimiter_pattern, 3);
                        material.ambientColor = BABYLON.Color3.FromArray(color);
                    }
                    else if (key === "ks") {
                        // Specular color (color when light is reflected from shiny surface) using RGB values
                        color = value.split(delimiter_pattern, 3);
                        material.specularColor = BABYLON.Color3.FromArray(color);
                    }
                    else if (key === "ns") {
                        material.specularPower = value;
                    }
                    else if (key === "d") {
                        //d is dissolve for current material
                        material.alpha = value;
                    }
                    else if (key === "map_ka") {
                        // ambient texture map with a loaded image
                        //We must first get the folder of the image
                        material.ambientTexture = new BABYLON.Texture(rootUrl + value, scene);
                    }
                    else if (key === "map_kd") {
                        // Diffuse texture map with a loaded image
                        material.diffuseTexture = new BABYLON.Texture(rootUrl + value, scene);
                    }
                    else if (key === "map_ks") {
                        // Specular texture map with a loaded image
                        //We must first get the folder of the image
                        material.specularTexture = new BABYLON.Texture(rootUrl + value, scene);
                    }
                    else if (key === "map_ns") {
                    }
                    else if (key === "map_bump") {
                        material.bumpTexture = new BABYLON.Texture(rootUrl + value, scene);
                    }
                    else if (key === "map_d") {
                        // The dissolve of the material
                        material.opacityTexture = new BABYLON.Texture(rootUrl + value, scene);
                    }
                    else if (key === "illum") {
                        //Illumination
                        if (value === "0") {
                        }
                        else if (value === "1") {
                        }
                        else if (value === "2") {
                        }
                        else if (value === "3") {
                        }
                        else if (value === "4") {
                        }
                        else if (value === "5") {
                        }
                        else if (value === "6") {
                        }
                        else if (value === "7") {
                        }
                        else if (value === "8") {
                        }
                        else if (value === "9") {
                        }
                        else if (value === "10") {
                        }
                    }
                    else {
                    }
                }
                //Add the last material
                this.materials.push(material);
            };
        }
        return MTLFileLoader;
    })();
    BABYLON.MTLFileLoader = MTLFileLoader;
    var OBJFileLoader = (function () {
        function OBJFileLoader() {
            this.extensions = ".obj";
            this.obj = /^o/;
            this.group = /^g/;
            this.mtllib = /^mtllib /;
            this.usemtl = /^usemtl /;
            this.smooth = /^s /;
            this.vertexPattern = /v( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;
            // vn float float float
            this.normalPattern = /vn( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;
            // vt float float
            this.uvPattern = /vt( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;
            // f vertex vertex vertex ...
            this.facePattern1 = /f\s(([\d]{1,}[\s]?){3,})+/;
            // f vertex/uvs vertex/uvs vertex/uvs ...
            this.facePattern2 = /f\s((([\d]{1,}\/[\d]{1,}[\s]?){3,})+)/;
            // f vertex/uvs/normal vertex/uvs/normal vertex/uvs/normal ...
            this.facePattern3 = /f\s((([\d]{1,}\/[\d]{1,}\/[\d]{1,}[\s]?){3,})+)/;
            // f vertex//normal vertex//normal vertex//normal ...
            this.facePattern4 = /f\s((([\d]{1,}\/\/[\d]{1,}[\s]?){3,})+)/;
        }
        /**
         * Calls synchronously the MTL file attached to this obj.
         * @param url The URL of the MTL file
         * @param rootUrl
         * @param onSuccess Callback function to be called when the MTL file is loaded
         * @private
         */
        OBJFileLoader.prototype._loadMTL = function (url, rootUrl, onSuccess) {
            var request = new XMLHttpRequest();
            var loadUrl = BABYLON.Tools.BaseUrl + rootUrl + url;
            request.open('GET', loadUrl, false);
            request.onreadystatechange = function () {
                if (request.readyState === 4) {
                    if (request.status === 200 || BABYLON.Tools.ValidateXHRData(request, 1)) {
                        onSuccess(request.responseText);
                    }
                    else {
                        console.warn("Error status: " + request.status + " - Unable to load " + loadUrl);
                    }
                }
            };
            request.send(null);
        };
        OBJFileLoader.prototype.importMesh = function (meshesNames, scene, data, rootUrl, meshes, particleSystems, skeletons) {
            return this._parseSolid(scene, data, rootUrl);
        };
        OBJFileLoader.prototype.load = function (scene, data, rootUrl) {
            //Get the 3D model
            return this.importMesh(null, scene, data, rootUrl, null, null, null);
        };
        OBJFileLoader.prototype._parseSolid = function (scene, data, rootUrl) {
            var positions = []; //values for the positions of vertices
            var normals = []; //Values for the normals
            var uvs = []; //Values for the textures
            var meshes = []; //[mesh] Contains all the obj meshes
            var currentMesh; //The current mesh of meshes array
            var indicesForBabylon = []; //
            var positionsForBabylon = []; //
            var uvsForBabylon = []; //Array with all value of uvs to match with the indices
            var normalsForBabylon = []; //Array with all value of normals to match with the indices
            var tuplePosNorm = []; //Create a tuple with indice of Position, Normal, UV            [pos, norm, uvs]
            var hasMeshes = false; //Meshes are defined in the file
            var hasObject = false; //Object is defined in the file
            var unwrappedPos = []; //Value of positionForBabylon w/o Vector3() [x,y,z]
            var unwrappedNorm = []; //Value of normalsForBabylon w/o Vector3()  [x,y,z]
            var unwrappedUV = []; //Value of uvsForBabylon w/o Vector3()      [x,y,z]
            var triangles = []; //Create triangles from polygon
            var materialName; //The name of the current material
            var lineToLoad = ""; //The line with the name of the mtllib file
            var materials = new MTLFileLoader();
            /**
             * Search for obj in the given array.
             * If found, returns its index. Returns -1 if not found
             */
            var isInArray = function (arr, obj) {
                var res = -1;
                for (var aa = 0; aa < arr.length; aa++) {
                    var v2 = arr[aa];
                    if (v2.x === obj.x && v2.y === obj.y) {
                        res = aa;
                    }
                }
                return res;
            };
            /**
             *
             */
            var setData = function (objIndice, objnormale, objPos, objTexture, objNor) {
                var tuple = new BABYLON.Vector2(objIndice, objnormale);
                var _index = isInArray(tuplePosNorm, tuple);
                if (_index == -1) {
                    indicesForBabylon.push(positionsForBabylon.length);
                    positionsForBabylon.push(objPos);
                    uvsForBabylon.push(objTexture);
                    normalsForBabylon.push(objNor);
                    tuplePosNorm.push(tuple);
                }
                else {
                    indicesForBabylon.push(_index);
                }
            };
            /**
             *
             */
            var unwrapData = function () {
                for (var l = 0; l < positionsForBabylon.length; l++) {
                    unwrappedPos.push(positionsForBabylon[l].x, positionsForBabylon[l].y, positionsForBabylon[l].z);
                    unwrappedNorm.push(normalsForBabylon[l].x, normalsForBabylon[l].y, normalsForBabylon[l].z);
                    unwrappedUV.push(uvsForBabylon[l].x, uvsForBabylon[l].y);
                }
            };
            var getTriangles = function (face, v) {
                //face = ["1","2","3","4","5","6"];
                //face = ["1/1","2/2","3/3","4/4","5/5","6/6"];
                //face = ["1/1/1","2/2/2","3/3/3","4/4/4","5/5/5","6/6/6"];
                //face = ["1//1","2//2","3//3","4//4","5//5","6//6"];
                if (v + 1 < face.length) {
                    //triangle = ["1","2","3","1","3","4"...]
                    //triangle = ["1/1","2/2","3/3","1/1","3/3","4/4"...]
                    //triangle = ["1/1/1","2/2/2","3/3/3","1/1/1","3/3/3","4/4/4"...]
                    //triangle = ["1//1","2//2","3//3","1//1","3//3","4//4"...]
                    triangles.push(face[0], face[v], face[v + 1]);
                    v += 1;
                    //Recursion
                    getTriangles(face, v);
                }
            };
            return true;
        };
        return OBJFileLoader;
    })();
    BABYLON.OBJFileLoader = OBJFileLoader;
    BABYLON.SceneLoader.RegisterPlugin(new OBJFileLoader());
})(BABYLON || (BABYLON = {}));
