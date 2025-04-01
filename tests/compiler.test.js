test('compiles addition function', () => {
    const code = `func add(a, b) => a + b`;
    expect(compile(code)).toMatchSnapshot();
  });