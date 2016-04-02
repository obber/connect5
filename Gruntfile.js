module.exports = function(grunt){
  grunt.initConfig({
    watch: {
      files: ['**/*'],
      tasks: ['concat', 'sass'],
    },

    concat: {
      dist: {
        src: ['src/js/app.js', 'src/js/state.js', 'src/js/board.js'],
        dest: 'dist/built.js',
      },
    },

    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          'dist/style.css': 'src/scss/style.scss'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-sass');

  grunt.registerTask('default', ['concat', 'sass']);

};
