@echo off

pushd ts

echo call tsc

call tsc.cmd
if errorlevel 1 goto ex

echo call rollup
call rollup -c

:ex

popd
pause
