@echo off
set JAVA_HOME=C:\Program Files\Java\jdk-17
set PATH=%JAVA_HOME%\bin;%PATH%

echo 正在清理本地Maven仓库中的mybatis依赖...
if exist "%USERPROFILE%\.m2\repository\org\mybatis" (
    rmdir /s /q "%USERPROFILE%\.m2\repository\org\mybatis"
    echo 已清理mybatis依赖缓存
) else (
    echo mybatis依赖缓存不存在
)

echo 正在强制更新Maven依赖...
mvnw.cmd dependency:resolve -U

echo 依赖更新完成！
pause