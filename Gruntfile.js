module.exports = function(grunt){
  grunt.initConfig({
    watch: {
      files: ['public/**/*'],
      tasks: ['concat', 'sass'],
    },

    concat: {
      dist: {
        src: ['public/src/js/app.js', 'public/src/js/idHelper.js', 'public/src/js/state.js', 'public/src/js/board.js'],
        dest: 'public/dist/built.js',
      },
    },

    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          'public/dist/style.css': 'public/src/scss/style.scss'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-sass');

  grunt.registerTask('default', ['concat', 'sass']);

};
