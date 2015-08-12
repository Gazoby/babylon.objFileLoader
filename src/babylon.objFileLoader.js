/// <reference path="../References/babylon.2.1.d.ts"/>
/// <reference path="../References/waa.d.ts"/>
var BABYLON;
(function (BABYLON) {
    /**
     * Class reading and parsing the MTL file bundled with the obj file.
     */
    var MTLFileLoader = (function () {
        function MTLFileLoader() {
            // All material loaded from the mtl will be set here
            this.materials = [];
            /**
             * This function will read the mtl file and create each material described inside
             * This function could be improve by adding :
             * -some component missing (Ni, Tf...)
             * -including the specific options available
             *
             * @param scene
             * @param data
             * @param rootUrl
             */
            this.parseMTL = function (scene, data, rootUrl) {
                //Split the lines from the file
                var lines = data.split('\n');
                //Space char
                var delimiter_pattern = /\s+/;
                //Array with RGB colors
                var color;
                //New material
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
                    //This mtl keyword will create the new material
                    if (key === "newmtl") {
                        //Check if it is the first material.
                        // Materials specifications are described after this keyword.
                        if (material) {
                            //Add the previous material in the material array.
                            this.materials.push(material);
                        }
                        //Create a new material.
                        // value is the name of the material read in the mtl file
                        material = new BABYLON.StandardMaterial(value, scene);
                    }
                    else if (key === "kd") {
                        // Diffuse color (color under white light) using RGB values
                        //value  = "r g b"
                        color = value.split(delimiter_pattern, 3);
                        //color = [r,g,b]
                        //Set tghe color into the material
                        material.diffuseColor = BABYLON.Color3.FromArray(color);
                    }
                    else if (key === "ka") {
                        // Ambient color (color under shadow) using RGB values
                        //value = "r g b"
                        color = value.split(delimiter_pattern, 3);
                        //color = [r,g,b]
                        //Set tghe color into the material
                        material.ambientColor = BABYLON.Color3.FromArray(color);
                    }
                    else if (key === "ks") {
                        // Specular color (color when light is reflected from shiny surface) using RGB values
                        //value = "r g b"
                        color = value.split(delimiter_pattern, 3);
                        //color = [r,g,b]
                        //Set the color into the material
                        material.specularColor = BABYLON.Color3.FromArray(color);
                    }
                    else if (key === "ns") {
                        //value = "Integer"
                        material.specularPower = value;
                    }
                    else if (key === "d") {
                        //d is dissolve for current material. It mean alpha for BABYLON
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
                        //The bump texture
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
                //At the end of the file, add the last material
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
         * Load function or importMesh function don't enable to load 2 files in the same time asynchronously.
         * Without this function materials are not displayed in the first frame (but displayed after).
         * In consequence it is impossible to get material information in your HTML file
         *
         * @param url The URL of the MTL file
         * @param rootUrl
         * @param onSuccess Callback function to be called when the MTL file is loaded
         * @private
         */
        OBJFileLoader.prototype._loadMTL = function (url, rootUrl, onSuccess) {
            //XMLHTTP object to load the file
            var request = new XMLHttpRequest();
            //The complete path to the mtl file
            var pathOfFile = BABYLON.Tools.BaseUrl + rootUrl + url;
            //Get the file synchronously
            request.open('GET', pathOfFile, false);
            //Check the server status
            request.onreadystatechange = function () {
                if (request.readyState === 4) {
                    if (request.status === 200 || BABYLON.Tools.ValidateXHRData(request, 1)) {
                        //Data are loaded
                        onSuccess(request.responseText);
                    }
                    else {
                        //File not found
                        console.warn("Error status: " + request.status + " - Unable to load " + pathOfFile);
                    }
                }
            };
            request.send(null);
        };
        OBJFileLoader.prototype.importMesh = function (meshesNames, scene, data, rootUrl, meshes, particleSystems, skeletons) {
            //get the meshes from OBJ file
            var mm = this._parseSolid(meshesNames, scene, data, rootUrl);
            //Push each mesh from OBJ file into the variable mesh of this function
            mm.forEach(function (m) {
                meshes.push(m);
            });
            return true;
        };
        OBJFileLoader.prototype.load = function (scene, data, rootUrl) {
            //Get the 3D model
            return this.importMesh(null, scene, data, rootUrl, null, null, null);
        };
        /**
         * Read the OBJ file and create an Array of meshes.
         * Each mesh contains all information given by the OBJ and the MTL file.
         * i.e. vertices positions and indices, optional normals values, optional UV values, optional material
         *
         * @param meshesNames
         * @param scene BABYLON.Scene The scene where are displayed the data
         * @param data String The content of the obj file
         * @param rootUrl String The path to the folder
         * @returns Array<AbstractMesh>
         * @private
         */
        OBJFileLoader.prototype._parseSolid = function (meshesNames, scene, data, rootUrl) {
            var positions = []; //values for the positions of vertices
            var normals = []; //Values for the normals
            var uvs = []; //Values for the textures
            var meshes = []; //[mesh] Contains all the obj meshes
            var currentMesh; //The current mesh of meshes array
            var indicesForBabylon = []; //The list of indices for VertexData
            var positionsForBabylon = []; //The list of position in vectors
            var uvsForBabylon = []; //Array with all value of uvs to match with the indices
            var normalsForBabylon = []; //Array with all value of normals to match with the indices
            var tuplePosNorm = []; //Create a tuple with indice of Position, Normal, UV  [pos, norm, uvs]
            var hasMeshes = false; //Meshes are defined in the file
            var unwrappedPos = []; //Value of positionForBabylon w/o Vector3() [x,y,z]
            var unwrappedNorm = []; //Value of normalsForBabylon w/o Vector3()  [x,y,z]
            var unwrappedUV = []; //Value of uvsForBabylon w/o Vector3()      [x,y,z]
            var triangles = []; //Indices from new triangles coming from polygons
            var materialName = ""; //The name of the current material
            var fileToLoad = ""; //The name of the mtlFile to load
            var materialsFromFile = new MTLFileLoader();
            /**
             * Search for obj in the given array.
             * This function is called to check if a couple of data already exists in an array.
             *
             * If found, returns the index of the founded tuple index. Returns -1 if not found
             * @param arr Array<BABYLON.Vector2>
             * @param obj BABYLON.Vector2
             * @returns {number}
             */
            var isInArray = function (arr, obj) {
                //Default value : not found
                var res = -1;
                for (var i = 0; i < arr.length; i++) {
                    var element = arr[i];
                    //Comparison of each element of the tuple
                    if (element.x === obj.x && element.y === obj.y) {
                        res = i;
                    }
                }
                //Return the indice of the founded element
                return res;
            };
            /**
             * This
             * Push a new indice otherwise
             * @param objIndice Integer The index in positions array
             * @param objNormale Integer The index in normals array
             * @param objPos Vector3 The value of position at index objIndice
             * @param objTexture Vector3 The value of uvs
             * @param objNor Vector3 The value of normals at index objNormale
             */
            var setData = function (objIndice, objNormale, objPos, objTexture, objNor) {
                //Create a new tuple composed with the indice of position and normal
                var tuple = new BABYLON.Vector2(objIndice, objNormale);
                //Check if this tuple already exists in the list of tuples
                var _index = isInArray(tuplePosNorm, tuple);
                //If it not exists
                if (_index == -1) {
                    //Add an new indice
                    indicesForBabylon.push(positionsForBabylon.length);
                    //Push the position for Babylon
                    positionsForBabylon.push(objPos);
                    //Push the uvs for Babylon
                    uvsForBabylon.push(objTexture);
                    //Push the normals for Babylon
                    normalsForBabylon.push(objNor);
                    //Add the tuple in the list
                    tuplePosNorm.push(tuple);
                }
                else {
                    //Add the index of the already existing tuple
                    //At this index we can get the value of position, normal and uvs of vertex
                    indicesForBabylon.push(_index);
                }
            };
            /**
             * Transform the Array of BABYLON.Vector3 onto an array of numbers
             */
            var unwrapData = function () {
                for (var l = 0; l < positionsForBabylon.length; l++) {
                    unwrappedPos.push(positionsForBabylon[l].x, positionsForBabylon[l].y, positionsForBabylon[l].z);
                    unwrappedNorm.push(normalsForBabylon[l].x, normalsForBabylon[l].y, normalsForBabylon[l].z);
                    unwrappedUV.push(uvsForBabylon[l].x, uvsForBabylon[l].y); //z is an optional value not supported by BABYLON
                }
            };
            /**
             * Create triangles from polygons by recursion
             * We get 4 patterns of face :
             * facePattern1 = ["1","2","3","4","5","6"]
             * facePattern2 = ["1/1","2/2","3/3","4/4","5/5","6/6"]
             * facePattern3 = ["1/1/1","2/2/2","3/3/3","4/4/4","5/5/5","6/6/6"]
             * facePattern4 = ["1//1","2//2","3//3","4//4","5//5","6//6"]
             * @param face Array[String] The indices of elements
             * @param v Integer The variable to increment
             */
            var getTriangles = function (face, v) {
                //Work for each element of the array
                if (v + 1 < face.length) {
                    //Add on the triangle variable the indexes to obtain triangles
                    triangles.push(face[0], face[v], face[v + 1]);
                    //Incrementation for recursion
                    v += 1;
                    //Recursion
                    getTriangles(face, v);
                }
                //Result obtained after 2 iterations:
                //Pattern1 => triangle = ["1","2","3","1","3","4"];
                //Pattern2 => triangle = ["1/1","2/2","3/3","1/1","3/3","4/4"];
                //Pattern3 => triangle = ["1/1/1","2/2/2","3/3/3","1/1/1","3/3/3","4/4/4"];
                //Pattern4 => triangle = ["1//1","2//2","3//3","1//1","3//3","4//4"];
            };
            /**
             * Create triangles and push the data for each polygon for the pattern 1
             * @param face
             * @param v
             */
            var dividePolygonsForPattern1 = function (face, v) {
                getTriangles(face, v);
                for (var k = 0; k < triangles.length; k++) {
                    // We check indices, uvs, normals
                    var objIndice = parseInt(triangles[k]) - 1;
                    var objUV = 0;
                    var objNormale = 0;
                    var objPos = positions[objIndice];
                    var objTexture = new BABYLON.Vector2(0, 0);
                    var objNor = new BABYLON.Vector3(0, 1, 0);
                    setData(objIndice, objNormale, objPos, objTexture, objNor);
                }
                triangles = [];
            };
            /**
             * Create triangles and push the data for each polygon for the pattern 2
             * @param face
             * @param v
             */
            var dividePolygonsForPattern2 = function (face, v) {
                getTriangles(face, v);
                for (var k = 0; k < triangles.length; k++) {
                    var point = triangles[k].split("/"); // ["1", "1"]
                    // We check indices, uvs, normals
                    var objIndice = parseInt(point[0]) - 1;
                    var objUV = parseInt(point[1]) - 1;
                    var objNormale = 0;
                    var objPos = positions[objIndice];
                    var objTexture = uvs[objUV];
                    var objNor = new BABYLON.Vector3(0, 1, 0);
                    setData(objIndice, objNormale, objPos, objTexture, objNor);
                }
                triangles = [];
            };
            /**
             * Create triangles and push the data for each polygon for the pattern 3
             * @param face
             * @param v
             */
            var dividePolygonsForPattern3 = function (face, v) {
                getTriangles(face, v);
                for (var k = 0; k < triangles.length; k++) {
                    var point = triangles[k].split("/"); // ["1", "1", "1"]
                    // We check indices, uvs, normals
                    var objIndice = parseInt(point[0]) - 1;
                    var objUV = parseInt(point[1]) - 1;
                    var objNormale = parseInt(point[2]) - 1;
                    var objPos = positions[objIndice];
                    var objTexture = uvs[objUV];
                    var objNor = normals[objNormale];
                    setData(objIndice, objNormale, objPos, objTexture, objNor);
                }
                triangles = [];
            };
            /**
             * Create triangles and push the data for each polygon for the pattern 4
             * @param face
             * @param v
             */
            var dividePolygonsForPattern4 = function (face, v) {
                getTriangles(face, v);
                for (var k = 0; k < triangles.length; k++) {
                    var point = triangles[k].split("//"); // ["1", "1"]
                    // We check indices, uvs, normals
                    var objIndice = parseInt(point[0]) - 1;
                    var objUV = 1;
                    var objNormale = parseInt(point[1]) - 1;
                    var objPos = positions[objIndice];
                    var objTexture = new BABYLON.Vector2(0, 0);
                    var objNor = normals[objNormale];
                    setData(objIndice, objNormale, objPos, objTexture, objNor);
                }
                triangles = [];
            };
            //Split the file into lines
            var lines = data.split('\n');
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];
                line = line.trim();
                var result;
                //Comment or newLine
                if (line.length === 0 || line.charAt(0) === '#') {
                    continue;
                }
                else if ((result = this.vertexPattern.exec(line)) !== null) {
                    //Add the positions data
                    //Value of result:
                    // ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]
                    var vectVertex = new BABYLON.Vector3(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3]));
                    positions.push(vectVertex);
                }
                else if ((result = this.normalPattern.exec(line)) !== null) {
                    //Add the normals data
                    //Value of result
                    // ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]
                    var vectNormals = new BABYLON.Vector3(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3]));
                    normals.push(vectNormals);
                }
                else if ((result = this.uvPattern.exec(line)) !== null) {
                    //Add the uvs data
                    //Value of result
                    // ["vt 0.1 0.2 0.3", "0.1", "0.2"]
                    var vectUV = new BABYLON.Vector2(parseFloat(result[1]), parseFloat(result[2]));
                    uvs.push(vectUV);
                }
                else if ((result = this.facePattern3.exec(line)) !== null) {
                    //Value of result:
                    //["f 1/1/1 2/2/2 3/3/3", "1/1/1 2/2/2 3/3/3"...]
                    result = result[1].trim();
                    var face = result.split(" "); // ["1/1/1", "2/2/2", "3/3/3"]
                    dividePolygonsForPattern3(face, 1);
                }
                else if ((result = this.facePattern4.exec(line)) !== null) {
                    //Value of result:
                    //["f 1//1 2//2 3//3", "1//1 2//2 3//3"...]
                    result = result[1].trim();
                    var face = result.split(" "); // ["1//1", "2//2", "3//3"]
                    dividePolygonsForPattern4(face, 1);
                }
                else if ((result = this.facePattern2.exec(line)) !== null) {
                    //Value of result:
                    //["f 1/1 2/2 3/3", "1/1 2/2 3/3"...]
                    result = result[1].trim();
                    var face = result.split(" "); // ["1/1", "2/2", "3/3"]
                    dividePolygonsForPattern2(face, 1);
                }
                else if ((result = this.facePattern1.exec(line)) !== null) {
                    //Value of result
                    //["f 1 2 3", "1 2 3"...]
                    result = result[1].trim();
                    var face = result.split(" "); // ["1", "2", "3"]
                    dividePolygonsForPattern1(face, 1);
                }
                else if (this.group.test(line) || this.obj.test(line)) {
                    //Create a new mesh corresponding to the name of the group.
                    //Definition of the mesh
                    var mesh = {
                        name: line.substring(2).trim(),
                        indices: undefined,
                        positions: undefined,
                        normals: undefined,
                        uvs: undefined,
                        materialName: ""
                    };
                    //If it is not the first mesh. Otherwise we don't have data.
                    if (meshes.length > 0) {
                        //Get the previous mesh for applying the data about the faces
                        //=> in obj file, faces definition append after the name of the mesh
                        currentMesh = meshes[meshes.length - 1];
                        //Set the data into Array for the mesh
                        unwrapData();
                        // Reverse tab. Otherwise face are displayed in the wrong sens
                        indicesForBabylon.reverse();
                        //Set the information for the mesh
                        currentMesh.indices = indicesForBabylon.slice();
                        currentMesh.positions = unwrappedPos.slice();
                        currentMesh.normals = unwrappedNorm.slice();
                        currentMesh.uvs = unwrappedUV.slice();
                        //Reset the array for the next mesh
                        indicesForBabylon = [];
                        unwrappedPos = [];
                        unwrappedNorm = [];
                        unwrappedUV = [];
                    }
                    meshes.push(mesh);
                    hasMeshes = true;
                }
                else if (this.usemtl.test(line)) {
                    //Get the name of the material
                    materialName = line.substring(7).trim();
                    //If meshes are already defined
                    if (hasMeshes) {
                        var m = meshes.length;
                        //Set the material name to the previous mesh (1 material per mesh)
                        meshes[m - 1].materialName = materialName;
                    }
                }
                else if (this.mtllib.test(line)) {
                    //Get the name of mtlFile
                    fileToLoad = line.substring(7).trim();
                }
                else if (this.smooth.test(line)) {
                }
                else {
                    //If there is another possibility
                    console.log("Unhandled expression at line : " + line);
                }
            }
            if (hasMeshes) {
                //Set the data for the last mesh
                currentMesh = meshes[meshes.length - 1];
                //Reset indices for displaying faces in the good sens
                indicesForBabylon.reverse();
                unwrapData();
                currentMesh.indices = indicesForBabylon;
                currentMesh.positions = unwrappedPos;
                currentMesh.normals = unwrappedNorm;
                currentMesh.uvs = unwrappedUV;
            }
            if (!hasMeshes) {
                //If there is no object name or no mesh name
                var myname = BABYLON.Geometry.RandomId();
                //Get positions normals uvs
                unwrapData();
                // reverse tab of indices
                indicesForBabylon.reverse();
                //Set data for one mesh
                meshes.push({
                    name: myname,
                    indices: indicesForBabylon,
                    positions: unwrappedPos,
                    normals: unwrappedNorm,
                    uvs: unwrappedUV,
                    materialName: materialName
                });
            }
            //Create a BABYLON mesh list
            var vertexData = new BABYLON.VertexData(); //The container for the values
            var babMeshArray = []; //The mesh for babylon
            var matToUse = [];
            for (var j = 0; j < meshes.length; j++) {
                //check meshesNames (stlFileLoader)
                if (meshesNames && meshes[j].name) {
                    if (meshesNames instanceof Array) {
                        if (meshesNames.indexOf(meshes[j].name) == -1) {
                            continue;
                        }
                    }
                    else {
                        if (meshes[j].name !== meshesNames) {
                            continue;
                        }
                    }
                }
                //Set the data with VertexBuffer for each mesh
                currentMesh = meshes[j];
                var babMesh = new BABYLON.Mesh(meshes[j].name, scene);
                matToUse.push(meshes[j].materialName);
                //Set the data for the babMesh
                vertexData.positions = currentMesh.positions;
                vertexData.normals = currentMesh.normals;
                vertexData.uvs = currentMesh.uvs;
                vertexData.indices = currentMesh.indices;
                vertexData.applyToMesh(babMesh);
                babMeshArray.push(babMesh);
            }
            //load the materials
            if (fileToLoad !== "") {
                this._loadMTL(fileToLoad, rootUrl, function (dataLoaded) {
                    //Create materials
                    materialsFromFile.parseMTL(scene, dataLoaded, rootUrl);
                    for (var o = 0; o < materialsFromFile.materials.length; o++) {
                        var _index = matToUse.indexOf(materialsFromFile.materials[o].name);
                        if (_index == -1) {
                            materialsFromFile.materials[o].dispose();
                        }
                        else {
                            babMeshArray[_index].material = materialsFromFile.materials[o];
                        }
                    }
                });
            }
            return babMeshArray;
        };
        return OBJFileLoader;
    })();
    BABYLON.OBJFileLoader = OBJFileLoader;
    BABYLON.SceneLoader.RegisterPlugin(new OBJFileLoader());
})(BABYLON || (BABYLON = {}));
