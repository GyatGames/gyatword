file://<WORKSPACE>/puzzle/main.scala
### java.lang.IndexOutOfBoundsException: -1

occurred in the presentation compiler.

presentation compiler configuration:


action parameters:
offset: 1047
uri: file://<WORKSPACE>/puzzle/main.scala
text:
```scala
package com.papauschek.puzzle
import scala.io.Source

object RunFunction {
  def main(args: Array[String]): Unit = {
    //val config = PuzzleConfig(width = 20, height = 20)
    //val words = Set("COOK", "RIZZ", "SKIBIDI")

    if (args.length < 3) {
      println("Usage: RunFunction <width> <height> <file>")
      sys.exit(1)
    }
    
    val width = args(0).toInt
    val height = args(1).toInt
    val filePath = args(2)

    val words = Source.fromFile(filePath).getLines().toSet
    val config = PuzzleConfig(width = width, height = height)
    val newPuzzle = Puzzle.generate(words.head, words.tail.toList, config)


    //val puzzle = Puzzle.empty(config).copy(chars = Array.fill(config.width * config.height)(' '), config = config, words = words)
    
    // Example: Call the density function and print the result
    //println(puzzle.density)
    
    // Example: Generate a new puzzle and print it
    //val newPuzzle = Puzzle.generate("COOK", List("RIZZ", "SKIBIDI"), config)
    //newPuzzle.foreach(println)
    println(newPuzzle[@@])
  }
}
```



#### Error stacktrace:

```
scala.collection.LinearSeqOps.apply(LinearSeq.scala:129)
	scala.collection.LinearSeqOps.apply$(LinearSeq.scala:128)
	scala.collection.immutable.List.apply(List.scala:79)
	dotty.tools.dotc.util.Signatures$.applyCallInfo(Signatures.scala:244)
	dotty.tools.dotc.util.Signatures$.computeSignatureHelp(Signatures.scala:104)
	dotty.tools.dotc.util.Signatures$.signatureHelp(Signatures.scala:88)
	dotty.tools.pc.SignatureHelpProvider$.signatureHelp(SignatureHelpProvider.scala:47)
	dotty.tools.pc.ScalaPresentationCompiler.signatureHelp$$anonfun$1(ScalaPresentationCompiler.scala:422)
```
#### Short summary: 

java.lang.IndexOutOfBoundsException: -1