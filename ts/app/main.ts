import * as Lib from "./littleLib";
import { RubiksCube } from "./rubiksCube/rubiksCube";

const rubiksCube = new RubiksCube(Lib.get.canvas("canvas"));
rubiksCube.start();
