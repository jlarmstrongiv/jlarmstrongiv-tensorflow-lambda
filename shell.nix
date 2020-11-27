with import <nixpkgs> {};
stdenv.mkDerivation rec {
  name = "env";
  env = buildEnv { name = name; paths = buildInputs; };
  buildInputs = [
    python2
    nodejs-12_x
    yarn
  ];

  shellHook =
    ''
      export PATH=$PWD/node_modules/.bin/:"$PATH"
    '';
}
