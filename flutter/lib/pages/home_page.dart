import 'package:filmsearch/main.dart';
import 'package:filmsearch/models/film.dart';
import 'package:filmsearch/pages/details_page.dart';
import 'package:flutter/material.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final filmsFuture = supabase
      .from('films')
      .select<List<Map<String, dynamic>>>()
      .withConverter<List<Film>>((data) => data.map(Film.fromJson).toList());

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Films'),
      ),
      body: FutureBuilder(
          future: filmsFuture,
          builder: (context, snapshot) {
            if (snapshot.hasError) {
              return Center(
                child: Text(snapshot.error.toString()),
              );
            }
            if (!snapshot.hasData) {
              return const Center(child: CircularProgressIndicator());
            }
            final films = snapshot.data!;
            return ListView.builder(
              itemBuilder: (context, index) {
                final film = films[index];
                return InkWell(
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (context) => DetailsPage(film: film),
                      ),
                    );
                  },
                  child: Stack(
                    children: [
                      Hero(
                        tag: film.imageUrl,
                        child: Image.network(film.imageUrl),
                      ),
                      Positioned.fill(
                        top: null,
                        child: DecoratedBox(
                          decoration: BoxDecoration(
                              gradient: LinearGradient(
                            begin: Alignment.bottomCenter,
                            end: Alignment.topCenter,
                            colors: [
                              Colors.black,
                              Colors.black.withAlpha(0),
                            ],
                          )),
                          child: Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: Text(
                              film.title,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 20,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              },
              itemCount: films.length,
            );
          }),
    );
  }
}
