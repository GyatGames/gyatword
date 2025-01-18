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
    println(newPuzzle.head)
  }
}