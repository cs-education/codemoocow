// Generated by CoffeeScript 1.6.2
(function() {
  "use strict";
  var getOrCreateCodeRunner, initializeDoppioEnvironment, load_mini_rt, root, saveFile,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  root = window.coderunner = {};

  load_mini_rt = function() {
    var data, done, e, file_count, writeOneFile;

    try {
      data = node.fs.readFileSync("/home/doppio/scripts/demo/mini-rt.tar");
    } catch (_error) {
      e = _error;
      console.error(e);
    }
    if (data === null) {
      throw new Error("No mini-rt data");
    }
    file_count = 0;
    done = false;
    writeOneFile = function(percent, path, file) {
      var base, base_dir, cls, ext, _ref;

      base_dir = 'vendor/classes/';
      _ref = path.split('.'), base = _ref[0], ext = _ref[1];
      file_count++;
      cls = base.substr(base_dir.length);
      return node.fs.writeFileSync(path, util.array_to_bytestr(file), 'utf8', true);
    };
    return untar(new util.BytesArray(util.bytestr_to_array(data)), writeOneFile);
  };

  saveFile = function(fname, contents) {
    if (contents[contents.length - 1] !== '\n') {
      contents += '\n';
    }
    return node.fs.writeFileSync(fname, contents);
  };

  initializeDoppioEnvironment = function() {
    var read_classfile;

    if (root.doppioEnvironmentInitialized) {
      return;
    }
    load_mini_rt();
    read_classfile = function(cls, cb, failure_cb) {
      var data, e, fullpath, path, _i, _len, _ref;

      cls = cls.slice(1, -1);
      _ref = jvm.system_properties['java.class.path'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        path = _ref[_i];
        fullpath = "" + path + cls + ".class";
        try {
          data = util.bytestr_to_array(node.fs.readFileSync(fullpath));
        } catch (_error) {
          e = _error;
          data = null;
        }
        if (data !== null) {
          return cb(data);
        }
      }
      return failure_cb(function() {
        throw new Error("Error: No file found for class " + cls + ".");
      });
    };
    root._bs_cl = new ClassLoader.BootstrapClassLoader(read_classfile);
    return root.doppioEnvironmentInitialized = true;
  };

  getOrCreateCodeRunner = function(element) {
    var coderunner, e;

    e = $(element);
    coderunner = e.data('coderunner');
    if (coderunner === void 0) {
      coderunner = new window.CodeRunner(element);
      e.data('coderunner', coderunner);
    }
    return coderunner;
  };

  root.edit = function(element) {
    return getOrCreateCodeRunner(element).edit();
  };

  root.run = function(element) {
    return getOrCreateCodeRunner(element).run();
  };

  window.CodeRunner = (function() {
    CodeRunner.prototype.stdout = null;

    CodeRunner.prototype.user_input = null;

    function CodeRunner(element) {
      var JavaMode, control, e, item, position, val, _i, _j, _len, _len1, _ref, _ref1,
        _this = this;

      this.element = element;
      this.run = __bind(this.run, this);
      this.edit = __bind(this.edit, this);
      this.rs = null;
      this.parentDiv = $('<div/>', {
        name: 'runjava-parent',
        style: 'position:static;',
        height: '100'
      });
      this.editorDiv = $('<div/>', {
        name: 'runjava-editor',
        style: "",
        id: 'fubar'
      });
      this.controlsDiv = $('<div/>', {
        name: 'runjava-controls'
      });
      this.outputDiv = $('<div/>', {
        name: 'runjava-output',
        text: ''
      });
      this.runJavaBtn = $('<button/>', {
        name: 'runjava-ctrl-run',
        text: 'run',
        type: 'button'
      });
      this.stopJavaBtn = $('<button/>', {
        name: 'runjava-ctrl-stop',
        text: 'stop',
        type: 'button'
      });
      this.resetCodeBtn = $('<button/>', {
        name: 'runjava-ctrl-reset',
        text: 'reset',
        type: 'button'
      });
      $(this.element).parent().append(this.parentDiv);
      this.parentDiv.after(this.outputDiv);
      this.parentDiv.after(this.controlsDiv);
      _ref = [this.editorDiv, this.outputDiv, this.controlsDiv];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        this.parentDiv.append(item);
      }
      _ref1 = [this.runJavaBtn, this.stopJavaBtn, this.resetCodeBtn];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        control = _ref1[_j];
        this.controlsDiv.append(control);
        control.css('border', '2px solid gray');
      }
      this.editor = ace.edit('fubar');
      JavaMode = require("ace/mode/java").Mode;
      this.session = this.editor.getSession();
      this.session.setMode(new JavaMode());
      val = this.element.innerHTML;
      if (val) {
        this.session.setValue(val);
      }
      e = $(this.element);
      position = this.element.getBoundingClientRect();
      this.blurb = {
        "left": position.left + "px",
        "right": position.right + "px",
        "top": position.top + "px",
        "bottom": (position.bottom + 100) + "px"
      };
      this.resizeEditor = function() {
        position = _this.element.getBoundingClientRect();
        _this.editorDiv.css("position", "absolute");
        _this.blurb = {
          "left": position.left + "px",
          "top": position.top + "px"
        };
        _this.editorDiv.width = 200 + position.right - position.left;
        return _this.editorDiv.height = 200 + position.bottom - position.top;
      };
      this.editor.getSession().on('change', function(e) {});
      this.runJavaBtn.click(function(e) {
        _this.run();
        return e.preventDefault();
      });
      return;
    }

    CodeRunner.prototype.edit = function() {
      this.editor.focus();
      return this;
    };

    CodeRunner.prototype.run = function() {
      var class_args, contents, finish_cb, fname, msg, stdin, stdout,
        _this = this;

      this.outputDiv.text('Starting...5..4..3..');
      initializeDoppioEnvironment();
      this.outputDiv.text(this.outputDiv.text() + '2..');
      fname = "program.bsh";
      contents = this.session.getValue();
      saveFile(fname, contents);
      msg = '';
      stdout = function(str) {
        msg += str;
        return this.outputDiv.text(msg);
      };
      stdin = function() {
        return "\n";
      };
      class_args = [fname];
      finish_cb = function() {
        return _this.rs = null;
      };
      this.rs = new runtime.RuntimeState(stdout, stdin, root._bs_cl);
      this.outputDiv.text(this.outputDiv.text() + '1..');
      this.stopJavaBtn.click(function(e) {
        var aborted_cb;

        stdout('Stopping...');
        aborted_cb = function() {
          return stdout('Stopped');
        };
        if (_this.rs) {
          _this.rs.abortjvm(aborted_cb);
        }
        return e.preventDefault();
      });
      finish_cb = function() {
        return _this.edit();
      };
      this.outputDiv.text('');
      jvm.run_class(this.rs, 'bsh/Interpreter', class_args, finish_cb);
      return this;
    };

    return CodeRunner;

  })();

}).call(this);
