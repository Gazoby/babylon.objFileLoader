module.exports = function (grunt) {
	
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
        ts: {
            // a particular target
            objloader: {
                src: ["src/*.ts", "!src/*.d.ts"],
				//outDir: "js" ,
				options: {
					compile: true,                 
					comments: true,               
					target: 'es5',
					sourceMap: false,
					sourceRoot: '',
					declaration: false
				}
            }
        }
    });
	
  grunt.loadNpmTasks("grunt-ts");
	
  grunt.registerTask('default', ['ts']);
};