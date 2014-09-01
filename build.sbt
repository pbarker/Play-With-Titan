
name := "Play-With-Titan"

version := "1.0-SNAPSHOT"

libraryDependencies ++= {
  Seq(
    "com.thinkaurelius.titan" % "titan-berkeleyje" % "0.5.0",
    "com.thinkaurelius.titan" % "titan-core" % "0.5.0",
    "com.thinkaurelius.titan" % "titan-es" % "0.5.0",
    "com.thinkaurelius.titan" % "titan-lucene" % "0.5.0",
    "com.thinkaurelius.titan" % "titan-test" % "0.5.0",
    "com.tinkerpop.blueprints" % "blueprints-core" % "2.5.0",
    "com.michaelpollmeier" %% "gremlin-scala" % "2.5.0",
    "com.ansvia.graph" %% "blueprints-scala" % "0.1.17",
    "org.reflections" % "reflections" % "0.9.8" notTransitive (),
    jdbc,
    anorm,
    cache
  )
}

play.Project.playScalaSettings
