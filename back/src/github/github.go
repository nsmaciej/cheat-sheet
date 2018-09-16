package github

import (
	"context"
	"fmt"
	"strings"

	"github.com/google/go-github/github"
	"golang.org/x/oauth2"
)

// Resource is a resource.
type Resource struct {
	DownloadURL string
	GithubURL   string
	Filename    string
}

// Client is the client.
type Client *github.Client

// GetLinks gets links.
func GetLinks(githubRepo string, client *github.Client, extensions []string) ([]Resource, error) {
	s := strings.Split(githubRepo, "/")
	if len(s) < 2 {
		return nil, fmt.Errorf("Invalid repo name")
	}
	user, repo := s[0], s[1]

	var links []Resource
	var recurse func(int, *string) error

	const fileCap = 20

	recurse = func(depth int, path *string) error {
		if depth > 2 {
			return nil
		}
		_, dc, _, err := client.Repositories.GetContents(context.Background(), user, repo, *path, nil)
		if err != nil {
			return err
		}
		if dc == nil {
			return fmt.Errorf("Unexpected file")
		}

		for _, file := range dc {
			if *file.Type == "file" {
				for _, ext := range extensions {
					if strings.HasSuffix(*file.Path, ext) {
						links = append(links, Resource{
							DownloadURL: *file.DownloadURL,
							Filename:    *file.Path,
							GithubURL:   *file.GitURL,
						})
						if len(links) >= fileCap {
							return nil
						}
						break
					}
				}
			} else if *file.Type == "dir" {
				if err := recurse(depth+1, file.Path); err != nil {
					return err
				}
			} else {
				fmt.Println("Skipping unknown content")
			}
		}
		return nil
	}

	root := "/"
	err := recurse(0, &root)
	return links, err
}

// NewClient gets client.
func NewClient() *github.Client {
	ts := oauth2.StaticTokenSource(
		&oauth2.Token{AccessToken: "6413f8b0ff215129d45432ac97f1bcc2463b0195"},
	)
	tc := oauth2.NewClient(context.Background(), ts)
	return github.NewClient(tc)
}
