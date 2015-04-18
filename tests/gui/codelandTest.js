describe("codelandTest",function() {

	var game = {
	  "title": "Code reader",
	  "description": "To write code, you must also read code and run it in your head!",
	  "task": "Work with parameters to functions!",
	  "tags": "intro",
	  "gameType": "grid",
	  "backEnd": "interpreter",
	  "editor": {
	    "freeformEditting": false,
	    "buttons": [
	      "deleteLine"
	    ],
	    "commands": {
	      "go": {
	        "inputs": 0,
	        "maxUses": 8
	      },
	      "turnLeft": {
	        "inputs": 0,
	        "maxUses": 3
	      },
	      "turnRight": {
	        "inputs": 0,
	        "maxUses": 4
	      }
	    }
	  },
	  "code": {
	    "shorthand": "LRRggRgLgggLRgg",
	    "comments" : [ "Puzzle #6 - 'Code reader'","Programmers must think carefully so their programs work correctly" ,
	"Often you need to check each and every step of your program."]
	  },
	  "game": {
	    "characterBase": {
	      "protagonist": {
	        "dir": 0
	      }
	    },
	    "map": ".X...\nXPXXX\nX.XXX\nX...X\n.XXFX\n.XXXX",
	    "offset": {
	      "x": 3,
	      "y": 3
	    }
	  },
	  "dyk": []
	};
	
	describe("getGameSequence",function() {
		it("Function is in place", function() {
			expect(root.getGameSequence).toEqual(jasmine.any(Function));
		});

		it("function correctly returns", function() {
			expect(root.getGameSequence()).not.toBeNull();
		});
	});

	describe("stringifyConfigArrays", function() {
		it("Functions is in place", function() {
			expect(root.stringifyConfigArrays).toEqual(jasmine.any(Function));
		})
	});
	
});