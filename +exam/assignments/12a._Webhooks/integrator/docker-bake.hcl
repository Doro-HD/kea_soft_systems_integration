target app {
    dockerfile = "./Dockerfile"
    target = "runner"
    context = "."
    tags = ["kea-si-12a"]
}
