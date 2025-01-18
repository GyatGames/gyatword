name := "crossword-puzzle-maker"

version := "0.1.0-SNAPSHOT"

scalaVersion := "3.2.0"


libraryDependencies ++= Seq(
  "com.lihaoyi" % "upickle_3" % "2.0.0"
)

mainClass in assembly := Some("com.papauschek.puzzle.RunFunction")
assemblyMergeStrategy in assembly := {
  case PathList("META-INF", xs @ _*) => MergeStrategy.discard
  case x => MergeStrategy.first
}